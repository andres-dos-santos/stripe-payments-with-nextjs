import Stripe from 'stripe'
import { NextResponse, NextRequest } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_API_KEY!)

export async function POST(req: NextRequest, res: NextResponse) {
  const payload = await req.text()

  const response = JSON.parse(payload)

  const sig = req.headers.get('Stripe-Signature')

  const dateTime = new Date(response?.created * 1000).toLocaleDateString()
  const timeString = new Date(response?.created * 1000).toLocaleDateString()

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )

    console.log(event?.type)

    return NextResponse.json({ staus: 'Success!', event: event?.type })
  } catch (error) {
    return NextResponse.json({ staus: 'Failed!', error })
  }
}
