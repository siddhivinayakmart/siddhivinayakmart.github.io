(function () {
  const CART_KEY = 'svm_cart_v1';
  const OWNER_WHATSAPP = '919453678641';

  const readCart = () => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch {
      return [];
    }
  };

  const writeCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  };

  let cart = readCart();

  const totalQty = () => cart.reduce((sum, item) => sum + item.qty, 0);
  const totalBill = () => cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  const overlay = document.createElement('div');
  overlay.className = 'cart-overlay';

  const drawer = document.createElement('aside');
  drawer.className = 'cart-drawer';
  drawer.innerHTML = `
    <div class="cart-head">
      <h3>Your Cart</h3>
      <button class="cart-close" type="button" aria-label="Close cart">✕</button>
    </div>
    <div class="cart-body">
      <div class="cart-empty">No items in cart yet.</div>
      <table class="cart-table" hidden>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody id="cart-items"></tbody>
      </table>
    </div>
    <div class="cart-foot">
      <div class="cart-total"><span>Total Bill</span><span id="cart-grand-total">₹0</span></div>
      <div class="payment-block">
        <div class="payment-title">Payment Method</div>
        <label class="payment-option">
          <input type="radio" name="payment-mode" value="online" checked />
          <span>Online Payment</span>
        </label>
        <label class="payment-option">
          <input type="radio" name="payment-mode" value="cod" />
          <span>Cash on Delivery (COD)</span>
        </label>
        <div class="online-payment-box" id="online-payment-box">
          <div class="fake-qr" aria-label="Demo QR for online payment"></div>
          <p class="payment-note">Demo QR for now. Scan and pay, then enter your UPI ID below.</p>
          <input id="upi-id" class="upi-input" type="text" placeholder="Enter your UPI ID (required)" />
        </div>
      </div>
      <div class="cart-actions">
        <button type="button" class="cart-btn cart-btn-clear" id="cart-clear">Clear</button>
        <button type="button" class="cart-btn cart-btn-send" id="cart-send">Send to WhatsApp</button>
      </div>
    </div>
  `;

  const fab = document.createElement('button');
  fab.type = 'button';
  fab.className = 'cart-fab';
  fab.innerHTML = `🛒 Cart <span class="cart-count" id="cart-count">0</span>`;

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);
  document.body.appendChild(fab);

  const cartCountEl = document.getElementById('cart-count');
  const cartItemsEl = drawer.querySelector('#cart-items');
  const cartTableEl = drawer.querySelector('.cart-table');
  const cartEmptyEl = drawer.querySelector('.cart-empty');
  const cartTotalEl = drawer.querySelector('#cart-grand-total');
  const upiInputEl = drawer.querySelector('#upi-id');
  const onlinePaymentBoxEl = drawer.querySelector('#online-payment-box');
  const paymentModeEls = drawer.querySelectorAll('input[name="payment-mode"]');

  const getPaymentMode = () => {
    const selected = drawer.querySelector('input[name="payment-mode"]:checked');
    return selected ? selected.value : 'online';
  };

  const togglePaymentUi = () => {
    const mode = getPaymentMode();
    const isOnline = mode === 'online';
    onlinePaymentBoxEl.hidden = !isOnline;
    if (!isOnline) {
      upiInputEl.value = '';
    }
  };

  const openCart = () => {
    drawer.classList.add('open');
    overlay.classList.add('open');
  };

  const closeCart = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
  };

  const render = () => {
    cartCountEl.textContent = String(totalQty());
    cartTotalEl.textContent = `₹${totalBill()}`;

    if (!cart.length) {
      cartTableEl.hidden = true;
      cartEmptyEl.hidden = false;
      cartItemsEl.innerHTML = '';
      return;
    }

    cartTableEl.hidden = false;
    cartEmptyEl.hidden = true;

    cartItemsEl.innerHTML = cart.map((item) => {
      const lineTotal = item.qty * item.price;
      return `
        <tr data-id="${item.id}">
          <td>
            <div class="cart-item-name">${item.name}</div>
            <button type="button" class="remove-btn" data-action="remove" data-id="${item.id}">Remove</button>
          </td>
          <td>
            <div class="qty-controls">
              <button type="button" data-action="dec" data-id="${item.id}">-</button>
              <span>${item.qty}</span>
              <button type="button" data-action="inc" data-id="${item.id}">+</button>
            </div>
          </td>
          <td>₹${item.price}</td>
          <td>₹${lineTotal}</td>
        </tr>
      `;
    }).join('');
  };

  const addItem = (id, name, price) => {
    const found = cart.find((item) => item.id === id);
    if (found) {
      found.qty += 1;
    } else {
      cart.push({ id, name, price, qty: 1 });
    }
    writeCart(cart);
    render();
  };

  const updateQty = (id, delta) => {
    const item = cart.find((line) => line.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter((line) => line.id !== id);
    }
    writeCart(cart);
    render();
  };

  const removeItem = (id) => {
    cart = cart.filter((line) => line.id !== id);
    writeCart(cart);
    render();
  };

  const clearCart = () => {
    cart = [];
    writeCart(cart);
    render();
  };

  const buildWhatsAppMessage = () => {
    const paymentMode = getPaymentMode();
    const upiId = upiInputEl.value.trim();
    const header = 'Item | Qty | Price | Total';
    const separator = '-'.repeat(44);
    const lines = cart.map((item) => {
      const total = item.qty * item.price;
      return `${item.name} | ${item.qty} | ₹${item.price} | ₹${total}`;
    });

    return [
      '🛒 *New Order Request*',
      '',
      '```',
      header,
      separator,
      ...lines,
      separator,
      `Grand Total: ₹${totalBill()}`,
      `Payment Mode: ${paymentMode === 'online' ? 'Online' : 'COD'}`,
      paymentMode === 'online' ? `UPI ID: ${upiId}` : 'UPI ID: N/A',
      '```',
      '',
      'Siddhi Vinayak Mart - Customer order from website'
    ].join('\n');
  };

  const sendToWhatsApp = () => {
    if (!cart.length) {
      alert('Cart is empty. Please add products first.');
      return;
    }

    const paymentMode = getPaymentMode();
    if (paymentMode === 'online') {
      const upiId = upiInputEl.value.trim();
      if (!upiId) {
        alert('Please enter your UPI ID after payment.');
        upiInputEl.focus();
        return;
      }
    }

    const url = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(buildWhatsAppMessage())}`;
    window.open(url, '_blank', 'noopener');
  };

  document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const { id, name, price } = button.dataset;
      const numericPrice = Number(price || 0);
      if (!id || !name || !numericPrice) {
        alert('This product is not configured for cart yet.');
        return;
      }
      addItem(id, name, numericPrice);
      openCart();
    });
  });

  drawer.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const action = target.dataset.action;
    const id = target.dataset.id;

    if (!action || !id) return;

    if (action === 'inc') updateQty(id, 1);
    if (action === 'dec') updateQty(id, -1);
    if (action === 'remove') removeItem(id);
  });

  fab.addEventListener('click', openCart);
  overlay.addEventListener('click', closeCart);
  drawer.querySelector('.cart-close').addEventListener('click', closeCart);
  drawer.querySelector('#cart-clear').addEventListener('click', clearCart);
  drawer.querySelector('#cart-send').addEventListener('click', sendToWhatsApp);
  paymentModeEls.forEach((el) => el.addEventListener('change', togglePaymentUi));

  togglePaymentUi();
  render();
})();
