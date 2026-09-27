/** MAISON NOIR — tiny store API (products, cart checkout stub, admin orders). */
const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

const PRODUCTS = [
  { id: 'ch-01', name: 'Noir Lounge Chair', collection: 'Salon', price: 18400, tag: 'Best seller' },
  { id: 'sf-01', name: 'Alexandria 3-Seat Sofa', collection: 'Salon', price: 42900, tag: 'New' },
  { id: 'tb-01', name: 'Marble Coffee Table', collection: 'Tables', price: 12750, tag: null },
  { id: 'bd-01', name: 'Sable Oak Bed', collection: 'Chambre', price: 35600, tag: null },
  { id: 'lp-01', name: 'Brass Floor Lamp', collection: 'Lumière', price: 6800, tag: 'Back in stock' },
  { id: 'cb-01', name: 'Walnut Sideboard', collection: 'Tables', price: 21300, tag: null },
];
const orders = [];

app.get('/api/products', (req, res) => {
  const { q, collection } = req.query;
  let list = PRODUCTS;
  if (collection) list = list.filter((p) => p.collection === collection);
  if (q) list = list.filter((p) => p.name.toLowerCase().includes(String(q).toLowerCase()));
  res.json(list);
});

// Checkout stub — swap body for a real Stripe PaymentIntent on the server.
app.post('/api/checkout', (req, res) => {
  const { items = [], name = 'Guest' } = req.body || {};
  if (!items.length) return res.status(422).json({ code: 422, message: 'Cart is empty' });
  const total = items.reduce((s, i) => {
    const p = PRODUCTS.find((x) => x.id === i.id);
    return s + (p ? p.price * (i.qty || 1) : 0);
  }, 0);
  const order = { id: 'MN-' + Date.now().toString(36).toUpperCase(), name, items, total, at: new Date() };
  orders.push(order);
  res.status(201).json({ orderId: order.id, total, next: 'attach Stripe PaymentIntent here' });
});

app.get('/api/admin/orders', (req, res) => res.json(orders));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 4100;
app.listen(PORT, () => console.log(`[maison-noir] http://localhost:${PORT}`));
