let cart = [];

// Charger les données du CMS (JSON)
async function fetchMenu() {
    try {
        const response = await fetch('data/menu.json');
        const data = await response.json();
        const container = document.getElementById('menu-container');
        container.innerHTML = '';

        data.plats.forEach((item, index) => {
            container.innerHTML += `
                <div class="card">
                    <img src="${item.image}" alt="${item.nom}">
                    <div class="card-content">
                        <h3>${item.nom}</h3>
                        <p class="price">${item.prix} FCFA</p>
                        <button class="btn-add" onclick="addToCart('${index}', '${item.nom}', ${item.prix})">Ajouter à ma commande</button>
                    </div>
                </div>`;
        });
    } catch (e) { console.error("Mode développement actif."); }
}

// Gestion du Panier
function addToCart(id, name, price) {
    let exists = cart.find(i => i.id === id);
    if (exists) exists.qty++;
    else cart.push({ id, name, price, qty: 1 });
    renderCart();
    if (document.getElementById('cart-modal').style.display !== 'flex') toggleCart();
}

function updateQty(id, change) {
    let item = cart.find(i => i.id === id);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    }
    renderCart();
}

function renderCart() {
    const list = document.getElementById('cart-content');
    const badge = document.getElementById('cart-badge');
    const totalEl = document.getElementById('total-amount');
    
    list.innerHTML = '';
    let total = 0, count = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
        count += item.qty;
        list.innerHTML += `
            <div class="cart-item">
                <div class="cart-info">
                    <strong>${item.name}</strong><br>
                    <small>${item.price} F</small>
                </div>
                <div class="qty-ctrl">
                    <button onclick="updateQty('${item.id}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button onclick="updateQty('${item.id}', 1)">+</button>
                </div>
            </div>`;
    });

    badge.innerText = count;
    totalEl.innerText = total.toLocaleString();
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
}

function sendOrder() {
    if (cart.length === 0) return alert("Votre panier est vide.");
    const phone = "22870019362"; 
    let text = "*COMMANDE - LA MARMITE DU TERROIR*\n\n";
    cart.forEach(i => text += `• ${i.qty}x ${i.name} (${i.price * i.qty} F)\n`);
    const finalTotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
    text += `\n*TOTAL : ${finalTotal} FCFA*`;
    
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`);
}

document.addEventListener('DOMContentLoaded', fetchMenu);