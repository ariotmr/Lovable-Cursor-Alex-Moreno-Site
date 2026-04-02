/**
 * Fire-and-forget helper to notify n8n of a site event via our secure proxy.
 * This ensures the webhook URL is never exposed to the client.
 */
export async function notifyN8n(data: Record<string, unknown>): Promise<void> {
  const proxyEndpoint = "/api/notify";

  try {
    // Add the timestamp as a default piece of data
    const payload = {
      ...data,
      submittedAt: new Date().toISOString()
    };

    // Use fire-and-forget logic: don't await the fetch response locally
    fetch(proxyEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("[notifyN8n] Error sending message:", err);
  }
}
