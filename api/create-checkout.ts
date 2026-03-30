import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16', // This is standard, but you can upgrade to latest if needed
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests for creating a checkout session
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { firstName, lastName, email, organization, reason, planType } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (!process.env.STRIPE_PRICE_ID) {
      throw new Error("STRIPE_PRICE_ID is not configured on the server.");
    }

    const appUrl = process.env.VITE_APP_URL || `https://${process.env.VERCEL_URL}` || "http://localhost:5173";

    // Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment', // Assuming one-time payment. Change to 'subscription' if recurring.
      customer_email: email,
      success_url: `${appUrl}/?success=true`,
      cancel_url: `${appUrl}/?canceled=true`,
      // Attach form data to metadata so the n8n webhook can access it after payment
      metadata: {
        firstName: firstName || '',
        lastName: lastName || '',
        email: email,
        organization: organization || '',
        reason: reason || '',
        planType: planType || 'Transformation Plan',
      },
    });

    // Return the session URL back to the frontend to handle the redirect
    return res.status(200).json({ url: session.url });
  } catch (err: unknown) {
    const error = err as any; 
    console.error('Stripe error:', error);
    return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
}
