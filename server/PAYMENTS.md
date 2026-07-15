# Payment gateway — wiring in Stripe (next step)

The shop is complete **up to** the card payment step, exactly as requested.
The checkout flow currently ends by creating an order in `pending_payment`
status. Here is where the Stripe card gateway plugs in.

## Integration point

`server/src/routes/orders.js` → `POST /api/orders` already returns a
`payment` object with the amount in cents and currency `eur`. Replace the
`not_configured` placeholder with a real Stripe PaymentIntent:

```js
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const intent = await stripe.paymentIntents.create({
  amount: Math.round(subtotal * 100),
  currency: 'eur',
  metadata: { order_num: orderNum },
  automatic_payment_methods: { enabled: true },
});
// return client_secret to the browser:
payment: { provider: 'stripe', clientSecret: intent.client_secret }
```

## Client side

In `client/src/pages/Checkout.jsx`, after the order is created, mount
**Stripe Elements** with the returned `clientSecret` and call
`stripe.confirmPayment(...)`. On success, redirect to the confirmation view.

## Confirming payment / stock

Add a Stripe **webhook** (`payment_intent.succeeded`) that:
1. flips the order `status` to `paid`, and
2. decrements `products.stock` for each order item.

`npm i stripe` on the server, add `STRIPE_SECRET_KEY` to `.env`, and add the
publishable key to the client. Nothing else in the codebase needs to change —
the order, cart, and confirmation screens are already built around this flow.
