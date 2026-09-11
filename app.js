let cart=[];
function money(n){return "฿"+n.toLocaleString("en-US")}
function addToCart(name,price){cart.push({name,price});document.getElementById("cartCount").textContent=cart.length;showToast(name+" SECURED IN CART");}
function openCart(){document.getElementById("cartModal").classList.remove("hidden");renderCart()}
function closeCart(){document.getElementById("cartModal").classList.add("hidden")}
function renderCart(){
  let box=document.getElementById("cartItems"),total=cart.reduce((s,x)=>s+x.price,0);
  box.innerHTML=cart.length?cart.map((x,i)=>`<div class="cart-line"><span><span class="cyan-text">[${i+1}]</span> ${x.name}</span><b>${money(x.price)}</b></div>`).join(""):`<p style="color:var(--text-muted); margin: 20px 0;">NO ITEMS DETECTED IN CART.</p>`;
  document.getElementById("cartTotal").textContent=money(total)
}
function checkout(){
  if(!cart.length){showToast("ERROR: CART EMPTY");return}
  showToast("PROMPTPAY DEMO INITIATED");closeCart()
}
function showToast(t){
  let el=document.getElementById("toast");
  el.textContent=t;el.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer=setTimeout(()=>el.classList.remove("show"),2400)
}
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}))}
