import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_mock", {
  apiVersion: "2023-10-16"
});

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const rawBody = await request.text();

  if (secret && signature) {
    try {
      const event = stripe.webhooks.constructEvent(rawBody, signature, secret);
      return NextResponse.json({ received: true, type: event.type });
    } catch (error) {
      return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
    }
  }

  try {
    const payload = rawBody ? JSON.parse(rawBody) : {};
    return NextResponse.json({ received: true, type: payload.type ?? "mock.event" });
  } catch (error) {
    return NextResponse.json({ error: "bad_payload" }, { status: 400 });
  }
}
