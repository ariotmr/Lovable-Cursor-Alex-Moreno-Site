/**
 * Fire-and-forget helper to notify n8n of a site event.
 * Never throws, never blocks the user experience.
 */
export async function notifyN8n(data: Record<string, unknown>): Promise<void> {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    // We use URLSearchParams to send the data as standard "Form Data".
    // This solves the "NESTED STRING" problem in n8n where the JSON is received as one long string.
    // Form data is natively parsed by n8n into separate variables in the 'body' object.
    const formParams = new URLSearchParams();
    
    // Add all incoming data to the form
    Object.entries(data).forEach(([key, value]) => {
      // If a value is null or undefined, don't send it or send empty string
      formParams.append(key, value !== null && value !== undefined ? String(value) : "");
    });
    
    // Add the timestamp
    formParams.append("submittedAt", new Date().toISOString());

    // Use fire-and-forget
    fetch(webhookUrl, {
      method: "POST",
      mode: "no-cors",
      // Important: Sending as 'x-www-form-urlencoded' allows n8n to auto-parse it into variables
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formParams,
    });
  } catch (err) {
    console.error("[notifyN8n] Error:", err);
  }
}
