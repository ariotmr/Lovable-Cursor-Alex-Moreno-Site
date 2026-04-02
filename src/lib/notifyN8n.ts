/**
 * Fire-and-forget helper to notify n8n of a site event via our secure proxy.
 * This ensures the webhook URL is never exposed to the client.
 */
export async function notifyN8n(data: Record<string, unknown>): Promise<void> {
  const proxyEndpoint = "/api/notify";

  // Add the timestamp as a default piece of data
  const payload = {
    ...data,
    submittedAt: new Date().toISOString()
  };

  // Fire-and-forget: don't await, but catch network errors
  fetch(proxyEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).catch((err) => {
    console.error("[notifyN8n] Error sending message:", err);
  });
}
