import { auth, currentUser } from "@clerk/nextjs/server"
import Stripe from "stripe"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  // Must be signed in
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const priceId: string | undefined = body?.priceId
  if (!priceId) {
    return NextResponse.json({ error: "Missing priceId" }, { status: 400 })
  }

  // Derive base URL from request so it works both locally and via dev tunnel
  const forwardedProto = req.headers.get("x-forwarded-proto") ?? "http"
  const forwardedHost  = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "localhost:3000"
  const baseUrl = `${forwardedProto}://${forwardedHost}`

  // Pull the user's email so Stripe pre-fills the checkout form
  const user  = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?checkout=success`,
    cancel_url:  `${baseUrl}/#pricing`,
    // Attach Clerk user ID so the webhook can look up the user
    client_reference_id: userId,
    ...(email ? { customer_email: email } : {}),
    metadata: { clerkUserId: userId },
  })

  return NextResponse.json({ url: session.url })
}
