import { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Proxy function to securely forward site notifications to n8n.
 * This keeps our internal N8N_WEBHOOK_URL hidden from the frontend.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL || process.env.VITE_N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error('[API/NOTIFY] Missing N8N_WEBHOOK_URL environment variable.');
    return res.status(500).json({ message: 'Internal Server Error: Missing Webhook Configuration' });
  }

  try {
    // Forward the request body directly to n8n
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API/NOTIFY] n8n responded with an error:', errorText);
      return res.status(response.status).json({ message: 'Notification failed' });
    }

    return res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('[API/NOTIFY] Internal error sending notification:', error);
    return res.status(500).json({ message: 'Internal server error while notifying n8n' });
  }
}
