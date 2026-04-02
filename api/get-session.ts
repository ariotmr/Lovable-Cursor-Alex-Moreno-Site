import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests for retrieving session details
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { session_id } = req.query;

  if (!session_id || typeof session_id !== 'string') {
    return res.status(400).json({ message: 'Missing session_id' });
  }

  try {
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items', 'payment_intent'],
    });

    // Return the specific details we need for the receipt
    return res.status(200).json({
      id: session.id,
      customer_details: session.customer_details,
      amount_total: session.amount_total,
      currency: session.currency,
      metadata: session.metadata,
      payment_status: session.payment_status,
      created: session.created,
      line_items: session.line_items?.data.map(item => ({
        description: item.description,
        amount_total: item.amount_total,
        quantity: item.quantity,
      }))
    });
  } catch (err: unknown) {
    const error = err as Error & { statusCode?: number };
    console.error('Stripe retrieval error:', error);
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
}
