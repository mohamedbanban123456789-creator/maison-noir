# MAISON NOIR — Luxury Furniture Store

Fictional Alexandria furniture house: faceted search, persisted cart (localStorage), checkout stub, admin orders feed.

## Run

```bash
npm install
npm start   # http://localhost:4100
```

- `GET /api/products?q=&collection=` — search/filter
- `POST /api/checkout` `{ items:[{id,qty}], name }` → `{ orderId, total }`
- `GET /api/admin/orders` — order console feed

Stripe note: the checkout stub computes totals server-side and returns where a real `PaymentIntent` attaches — implement with `stripe` package when going live.
