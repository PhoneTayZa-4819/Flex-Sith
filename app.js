// Data State
let cart = [];
const TAX_RATE = 0.07; // 7% VAT

// Utilities
function money(n) { return "฿" + n.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2}); }
function generateOrderId() { return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(); }

// Live Terminal Clock
function updateClock() {
  const now = new Date();
  const el = document.getElementById('liveTime');
  if(el) el.textContent = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC+7';
}
setInterval(updateClock, 1000);
updateClock();

// Interaction Functions
function showToast(msg) {
  let el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => el.classList.remove("show"), 2500);
}

function inspectModule(moduleName) {
  showToast(`SYSTEM: SCANNING ${moduleName.toUpperCase()} SPECS...`);
  setTimeout(() => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  }, 600);
}

// Cart Logic
function addToCart(name, price) {
  cart.push({ name, price });
  document.getElementById("cartCount").textContent = cart.length;
  showToast(name + " SECURED IN CART");
}

function openCart() {
  document.getElementById("cartModal").classList.remove("hidden");
  renderCart();
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

function renderCart() {
  let box = document.getElementById("cartItems");
  let total = cart.reduce((s, x) => s + x.price, 0);
  
  if (cart.length === 0) {
    box.innerHTML = `<p style="color:var(--text-muted); margin: 20px 0; text-align: center;">[ NO ITEMS DETECTED IN SECURE CART ]</p>`;
    document.getElementById("checkoutBtn").disabled = true;
    document.getElementById("checkoutBtn").style.opacity = "0.5";
  } else {
    box.innerHTML = cart.map((x, i) => `
      <div class="cart-line">
        <span><span class="cyan-text">[0${i+1}]</span> ${x.name}</span>
        <b>${money(x.price)}</b>
      </div>
    `).join("");
    document.getElementById("checkoutBtn").disabled = false;
    document.getElementById("checkoutBtn").style.opacity = "1";
  }
  document.getElementById("cartTotal").textContent = money(total);
}

// Checkout & Receipt Generation Simulation
function processCheckout() {
  if (!cart.length) return;
  
  let btn = document.getElementById("checkoutBtn");
  btn.innerHTML = "AUTHORIZING NETWORK... ⟳";
  btn.style.background = "var(--border-color)";
  
  // Simulate network delay for realism
  setTimeout(() => {
    generateReceipt();
    closeModal("cartModal");
    document.getElementById("receiptModal").classList.remove("hidden");
    
    // Reset cart after successful simulated purchase
    cart = [];
    document.getElementById("cartCount").textContent = "0";
    btn.innerHTML = "INITIATE PROMPTPAY";
    btn.style.background = "var(--red)";
    
    showToast("PAYMENT CLEARED. RECEIPT GENERATED.");
  }, 1500);
}

function generateReceipt() {
  let subtotal = cart.reduce((s, x) => s + x.price, 0);
  let tax = subtotal * TAX_RATE;
  let finalTotal = subtotal + tax;
  let dateStr = new Date().toLocaleString('en-US');
  let orderId = generateOrderId();
  
  let html = `
    <div class="receipt-header">
      <h2>FLEX SITH HQ</h2>
      <p>Tactical Bottle Workshop, Bangkok</p>
      <p>VAT INCLUDED (7%)</p>
    </div>
    
    <div class="receipt-row"><span>DATE:</span> <span>${dateStr}</span></div>
    <div class="receipt-row"><span>ORDER ID:</span> <span>${orderId}</span></div>
    <div class="receipt-row"><span>TERMINAL:</span> <span>PROMPTPAY ONLINE</span></div>
    <div class="receipt-row"><span>MERCHANT ID:</span> <span>240702404672-YORU</span></div>
    
    <div style="margin: 25px 0; border-top: 2px dashed #000; border-bottom: 2px dashed #000; padding: 10px 0;">
      <div class="receipt-row" style="font-weight: bold; margin-bottom: 10px;">
        <span>ITEM</span><span>AMT</span>
      </div>
      ${cart.map(item => `
        <div class="receipt-item">
          <span>${item.name}</span>
          <span>${money(item.price)}</span>
        </div>
      `).join('')}
    </div>
    
    <div class="receipt-row"><span>SUBTOTAL</span> <span>${money(subtotal)}</span></div>
    <div class="receipt-row"><span>VAT (7%)</span> <span>${money(tax)}</span></div>
    <div class="receipt-total"><span>TOTAL CHARGED</span> <span>${money(finalTotal)}</span></div>
    
    <div style="text-align: center; margin-top: 30px; font-size: 0.85rem; color: #555;">
      <p>Thank you for choosing FlexSith.</p>
      <p>Your hardware is being dispatched.</p>
      <p>*** CUSTOMER COPY ***</p>
    </div>
  `;
  
  document.getElementById("receiptContent").innerHTML = html;
}

// Service Worker Registration for PWA support
if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
}
