import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Initialize Supabase with Service Role to bypass RLS for server-side updates
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

// We must disable body parsing for the webhook so that we can verify the raw Stripe signature
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper buffer stream for raw body verification
async function buffer(readable: NodeJS.ReadableStream) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("Missing STRIPE_WEBHOOK_SECRET from environment variables.");
    }
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`Webhook signature verification failed: ${error.message}`);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const rawSession = event.data.object as Stripe.Checkout.Session;
    
    // Expand the session to get payment details (last4, etc.)
    const session = await stripe.checkout.sessions.retrieve(rawSession.id, {
      expand: ['payment_intent', 'payment_intent.latest_charge'],
    });
    
    // 1. Get the customer email from the successful transaction
    const customerEmail = session.customer_details?.email || session.metadata?.email;
    const firstName = session.metadata?.firstName || '';
    const lastName = session.metadata?.lastName || '';
    const organization = session.metadata?.organization || '';
    const reason = session.metadata?.reason || '';
    const planType = session.metadata?.planType || '';

    // Extract last4 from the expanded payment_intent -> latest_charge
    const paymentIntent = session.payment_intent as Stripe.PaymentIntent | null;
    const latestCharge = paymentIntent?.latest_charge as Stripe.Charge | null;
    const last4 = latestCharge?.payment_method_details?.card?.last4 || null;

    if (customerEmail && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log(`Payment successful for: ${customerEmail}. Upgrading to Client and recording payment...`);

      // 2. Identify and upgrade the user role in the 'profiles' table securely
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ role: 'client' })
        .eq('email', customerEmail)
        .select();

      if (profileError) {
        console.error("Supabase role upgrade failed:", profileError);
      } else {
        console.log(`Successfully upgraded profile for ${customerEmail}`);
      }
      
      // 3. Record the payment in the `payments` table
      const { error: paymentError } = await supabaseAdmin
        .from('payments')
        .insert({
          first_name: firstName,
          last_name: lastName,
          email: customerEmail,
          organization: organization,
          reason: reason,
          plan_type: planType,
          amount: session.amount_total,
          currency: session.currency,
          stripe_session_id: session.id,
          last4: last4,
          status: session.payment_status,
        });

      if (paymentError) {
        console.error("Supabase payment record failed:", paymentError);
      } else {
        console.log(`Successfully recorded payment for ${customerEmail} in Supabase`);
      }
      
    } else {
      console.warn("No customer email found in checkout session or missing SUPABASE_SERVICE_ROLE_KEY.");
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
}
