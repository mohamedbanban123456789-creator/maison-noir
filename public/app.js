const grid = document.getElementById('grid');
const cartEl = document.getElementById('cart');
const fmt = (n) => n.toLocaleString('en-EG') + ' EGP';
let products = [];
let cart = JSON.parse(localStorage.getItem('mn-cart') || '[]');

async function load(q) {
  const r = await fetch('/api/products' + (q ? '?q=' + encodeURIComponent(q) : ''));
  products = await r.json();
  grid.innerHTML = products.map((p) => `
    <article class="card">
      <p class="tag">${p.tag || p.collection}</p>
      <h3>${p.name}</h3><p class="col">${p.collection}</p>
      <p class="price">${fmt(p.price)}</p>
      <button data-add="${p.id}">Add to cart</button>
    </article>`).join('');
}
function save() { localStorage.setItem('mn-cart', JSON.stringify(cart)); render(); }
function render() {
  const rows = cart.map((i) => ({ ...i, p: products.find((x) => x.id === i.id) })).filter((x) => x.p);
  document.getElementById('count').textContent = rows.reduce((s, x) => s + x.qty, 0);
  document.getElementById('total').textContent = fmt(rows.reduce((s, x) => s + x.p.price * x.qty, 0));
  cartEl.innerHTML = rows.map((x) => `<li>${x.p.name} × ${x.qty} <button data-del="${x.id}">×</button></li>`).join('') || '<li class="dim">Empty — the showroom waits.</li>';
}
grid.addEventListener('click', (e) => {
  const id = e.target.dataset.add; if (!id) return;
  const line = cart.find((x) => x.id === id);
  line ? line.qty++ : cart.push({ id, qty: 1 }); save();
});
cartEl.addEventListener('click', (e) => {
  const id = e.target.dataset.del; if (!id) return;
  cart = cart.filter((x) => x.id !== id); save();
});
document.getElementById('q').addEventListener('input', (e) => load(e.target.value));
document.getElementById('buy').addEventListener('click', async () => {
  const name = document.getElementById('buyer').value || 'Guest';
  const r = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: cart, name }) });
  const msg = document.getElementById('msg');
  if (!r.ok) { msg.textContent = 'Cart is empty.'; return; }
  const o = await r.json();
  msg.textContent = `Merci, ${name}. Order ${o.orderId} — ${fmt(o.total)}.`;
  cart = []; save();
});
load().then(render);
