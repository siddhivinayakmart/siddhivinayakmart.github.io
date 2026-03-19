(function () {
  const CART_KEY = 'svm_cart_v1';
  const OWNER_WHATSAPP = '919453678641';
  const STORE_UPI_ID = 'siddhivinayakmart@upi';
  const STORE_LOCATION = { lat: 26.2824, lng: 83.7686 };
  const SERVICE_RADIUS_KM = 5;
  const DELIVERY_CHARGE = 20;
  const FREE_DELIVERY_THRESHOLD = 300;

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
  let checkoutStep = 1;
  let receiver = { name: '', phone: '', address: '' };
  let rangeStatus = 'unchecked';
  let rangeDistanceKm = null;

  const totalQty = () => cart.reduce((sum, item) => sum + item.qty, 0);
  const subTotal = () => cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const deliveryCharge = () => (subTotal() >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE);
  const totalBill = () => subTotal() + deliveryCharge();

  const toRadians = (value) => (value * Math.PI) / 180;
  const distanceInKm = (lat1, lon1, lat2, lon2) => {
    const earthRadiusKm = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  };

  const overlay = document.createElement('div');
  overlay.className = 'cart-overlay';

  const drawer = document.createElement('aside');
  drawer.className = 'cart-drawer';
  drawer.innerHTML = `
    <div class="cart-head">
      <h3>Your Cart</h3>
      <button class="cart-close" type="button" aria-label="Close cart">✕</button>
    </div>

    <div class="cart-progress" aria-label="Checkout progress">
      <div class="progress-step active" data-step-indicator="1"><span>1</span><small>Review</small></div>
      <div class="progress-line"></div>
      <div class="progress-step" data-step-indicator="2"><span>2</span><small>Details</small></div>
      <div class="progress-line"></div>
      <div class="progress-step" data-step-indicator="3"><span>3</span><small>Payment</small></div>
    </div>

    <div class="cart-body">
      <div id="step-1" class="checkout-pane">
        <p class="step-note">Step 1 of 3: Review products, quantity and price.</p>
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
        <div class="cart-total"><span>Subtotal</span><span id="cart-subtotal">₹0</span></div>
        <div class="cart-total"><span>Delivery</span><span id="cart-delivery">₹0</span></div>
        <div class="cart-total"><span>Total Bill</span><span id="cart-grand-total">₹0</span></div>
        <div class="cart-actions split-2">
          <button type="button" class="cart-btn cart-btn-clear" id="cart-clear">Clear Cart</button>
          <button type="button" class="cart-btn cart-btn-next" id="to-step-2">Confirm Order</button>
        </div>
      </div>

      <div id="step-2" class="checkout-pane" hidden>
        <p class="step-note">Step 2 of 3: Enter receiver details.</p>
        <input id="cust-name" class="upi-input" type="text" placeholder="Receiver Name" />
        <input id="cust-phone" class="upi-input" type="tel" placeholder="Receiver Contact Number" />
        <textarea id="cust-address" class="upi-input" rows="2" placeholder="Delivery Address / Location"></textarea>
        <div class="cart-actions split-2">
          <button type="button" class="cart-btn cart-btn-clear" id="back-step-1">Back</button>
          <button type="button" class="cart-btn cart-btn-next" id="to-step-3">Save & Proceed</button>
        </div>
      </div>

      <div id="step-3" class="checkout-pane" hidden>
        <p class="step-note">Step 3 of 3: Select payment mode and place order.</p>
        <div class="payment-block">
          <label class="payment-option">
            <input type="radio" name="payment-mode" value="online" checked />
            <span>Online Payment (QR)</span>
          </label>
          <label class="payment-option">
            <input type="radio" name="payment-mode" value="cod" />
            <span>Cash on Delivery (COD)</span>
          </label>

          <div class="online-payment-box" id="online-payment-box">
            <div class="fake-qr" aria-label="Demo QR for online payment"></div>
            <p class="payment-note">Demo QR for now. Pay using your UPI app.</p>
            <input id="merchant-upi-id" class="upi-input" type="text" readonly />
            <input id="sender-upi-id" class="upi-input" type="text" placeholder="Your UPI ID (required after payment)" />
          </div>
        </div>
        <div class="cart-total"><span>Total Amount Payable</span><span id="step3-total">₹0</span></div>
        <div class="cart-actions split-2">
          <button type="button" class="cart-btn cart-btn-clear" id="back-step-2">Back</button>
          <button type="button" class="cart-btn cart-btn-send" id="cart-send">Place Order</button>
        </div>
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
  const cartSubtotalEl = drawer.querySelector('#cart-subtotal');
  const cartDeliveryEl = drawer.querySelector('#cart-delivery');
  const cartTotalEl = drawer.querySelector('#cart-grand-total');
  const step3TotalEl = drawer.querySelector('#step3-total');

  const customerNameEl = drawer.querySelector('#cust-name');
  const customerPhoneEl = drawer.querySelector('#cust-phone');
  const customerAddressEl = drawer.querySelector('#cust-address');

  const merchantUpiEl = drawer.querySelector('#merchant-upi-id');
  const senderUpiEl = drawer.querySelector('#sender-upi-id');
  const onlinePaymentBoxEl = drawer.querySelector('#online-payment-box');
  const paymentModeEls = drawer.querySelectorAll('input[name="payment-mode"]');
  const progressSteps = drawer.querySelectorAll('[data-step-indicator]');

  const steps = {
    1: drawer.querySelector('#step-1'),
    2: drawer.querySelector('#step-2'),
    3: drawer.querySelector('#step-3')
  };

  merchantUpiEl.value = STORE_UPI_ID;

  const openCart = () => {
    drawer.classList.add('open');
    overlay.classList.add('open');
  };

  const closeCart = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
  };

  const showStep = (stepNumber) => {
    if (stepNumber === 2 && !cart.length) {
      stepNumber = 1;
    }

    if (stepNumber === 3) {
      const name = customerNameEl.value.trim();
      const phone = customerPhoneEl.value.trim();
      const address = customerAddressEl.value.trim();
      if (!cart.length) stepNumber = 1;
      else if (!name || !phone || !address) stepNumber = 2;
    }

    checkoutStep = stepNumber;
    Object.entries(steps).forEach(([key, stepEl]) => {
      stepEl.hidden = Number(key) !== stepNumber;
    });

    progressSteps.forEach((indicator) => {
      const indicatorStep = Number(indicator.dataset.stepIndicator);
      indicator.classList.toggle('active', indicatorStep === stepNumber);
      indicator.classList.toggle('done', indicatorStep < stepNumber);
    });
  };

  const getPaymentMode = () => {
    const selected = drawer.querySelector('input[name="payment-mode"]:checked');
    return selected ? selected.value : 'online';
  };

  const togglePaymentUi = () => {
    const isOnline = getPaymentMode() === 'online';
    onlinePaymentBoxEl.hidden = !isOnline;
    if (!isOnline) senderUpiEl.value = '';
  };

  const render = () => {
    cartCountEl.textContent = String(totalQty());
    cartSubtotalEl.textContent = `₹${subTotal()}`;
    cartDeliveryEl.textContent = deliveryCharge() === 0 ? 'FREE' : `₹${deliveryCharge()}`;
    cartTotalEl.textContent = `₹${totalBill()}`;
    step3TotalEl.textContent = `₹${totalBill()}`;

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
    if (found) found.qty += 1;
    else cart.push({ id, name, price, qty: 1 });

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
    receiver = { name: '', phone: '', address: '' };
    rangeStatus = 'unchecked';
    rangeDistanceKm = null;
    customerNameEl.value = '';
    customerPhoneEl.value = '';
    customerAddressEl.value = '';
    senderUpiEl.value = '';
    showStep(1);
    render();
  };

  const validateReceiverDetails = () => {
    const name = customerNameEl.value.trim();
    const phone = customerPhoneEl.value.trim();
    const address = customerAddressEl.value.trim();

    if (!name) {
      alert('Please enter receiver name.');
      customerNameEl.focus();
      return false;
    }
    if (!phone) {
      alert('Please enter contact number.');
      customerPhoneEl.focus();
      return false;
    }
    if (!address) {
      alert('Please enter delivery address/location.');
      customerAddressEl.focus();
      return false;
    }

    receiver = { name, phone, address };
    return true;
  };

  const buildWhatsAppMessage = () => {
    const paymentMode = getPaymentMode();
    const senderUpi = senderUpiEl.value.trim();
    const rangeLabel = rangeStatus === 'in-range'
      ? `In range (${rangeDistanceKm !== null ? `${rangeDistanceKm.toFixed(2)} km` : 'within 5 km'})`
      : (rangeStatus === 'out-of-range' ? 'Out of range request (owner approval needed)' : 'Not checked');

    const header = 'Item | Qty | Price | Total';
    const separator = '-'.repeat(44);
    const lines = cart.map((item) => {
      const total = item.qty * item.price;
      return `${item.name} | ${item.qty} | ₹${item.price} | ₹${total}`;
    });

    return [
      '🛒 *New Order Request*',
      '',
      `Receiver: ${receiver.name}`,
      `Contact: ${receiver.phone}`,
      `Address: ${receiver.address}`,
      '',
      '```',
      header,
      separator,
      ...lines,
      separator,
      `Subtotal: ₹${subTotal()}`,
      `Delivery: ${deliveryCharge() === 0 ? 'FREE' : `₹${deliveryCharge()}`}`,
      `Grand Total: ₹${totalBill()}`,
      `Range Status: ${rangeLabel}`,
      `Payment Mode: ${paymentMode === 'online' ? 'Online QR' : 'COD'}`,
      `Merchant UPI ID: ${paymentMode === 'online' ? STORE_UPI_ID : 'N/A'}`,
      `Customer UPI ID: ${paymentMode === 'online' ? senderUpi : 'N/A'}`,
      '```',
      '',
      'Siddhi Vinayak Mart - Customer order from website'
    ].join('\n');
  };

  const loadImage = (src) => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

  const createBillImageBlob = async () => {
    const paymentMode = getPaymentMode();
    const senderUpi = senderUpiEl.value.trim();
    const now = new Date();
    const rangeLabel = rangeStatus === 'in-range'
      ? `In range (${rangeDistanceKm !== null ? `${rangeDistanceKm.toFixed(2)} km` : 'within 5 km'})`
      : (rangeStatus === 'out-of-range' ? 'Out of range request - owner permission' : 'Not checked');

    const width = 1080;
    const rowHeight = 42;
    const tableRows = cart.length + 1;
    const tableTop = 390;
    const totalsTop = tableTop + tableRows * rowHeight + 24;
    const height = totalsTop + 280;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#d32f2f';
    ctx.fillRect(0, 0, width, 120);

    try {
      const logo = await loadImage('../image/logo.png');
      ctx.drawImage(logo, 34, 24, 72, 72);
    } catch {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(34, 24, 72, 72);
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 36px Poppins, sans-serif';
    ctx.fillText('Siddhi Vinayak A-Z Saving Mart', 128, 62);
    ctx.font = '500 20px Poppins, sans-serif';
    ctx.fillText('Customer Bill', 128, 92);

    ctx.fillStyle = '#202020';
    ctx.font = '600 21px Poppins, sans-serif';
    ctx.fillText(`Receiver: ${receiver.name}`, 40, 160);
    ctx.fillText(`Contact: ${receiver.phone}`, 40, 192);
    ctx.font = '500 19px Poppins, sans-serif';
    ctx.fillText(`Address: ${receiver.address}`, 40, 224);
    ctx.fillText(`Date: ${now.toLocaleString()}`, 40, 254);
    ctx.fillText(`Range: ${rangeLabel}`, 40, 284);
    ctx.fillText(`Payment Mode: ${paymentMode === 'online' ? 'Online QR' : 'COD'}`, 40, 314);
    ctx.fillText(`Merchant UPI ID: ${paymentMode === 'online' ? STORE_UPI_ID : 'N/A'}`, 40, 344);
    ctx.fillText(`Customer UPI ID: ${paymentMode === 'online' ? senderUpi : 'N/A'}`, 40, 374);

    ctx.fillStyle = '#f6f0ea';
    ctx.fillRect(30, tableTop - 28, 1020, rowHeight);
    ctx.fillStyle = '#111111';
    ctx.font = '600 19px Poppins, sans-serif';
    const colX = [40, 620, 760, 900];
    ctx.fillText('Item', colX[0], tableTop - 3);
    ctx.fillText('Qty', colX[1], tableTop - 3);
    ctx.fillText('Price', colX[2], tableTop - 3);
    ctx.fillText('Total', colX[3], tableTop - 3);

    ctx.font = '500 18px Poppins, sans-serif';
    cart.forEach((item, index) => {
      const y = tableTop + index * rowHeight;
      ctx.fillStyle = index % 2 === 0 ? '#ffffff' : '#fcf8f5';
      ctx.fillRect(30, y, 1020, rowHeight);
      ctx.fillStyle = '#1f1f1f';
      ctx.fillText(item.name, colX[0], y + 27);
      ctx.fillText(String(item.qty), colX[1], y + 27);
      ctx.fillText(`₹${item.price}`, colX[2], y + 27);
      ctx.fillText(`₹${item.qty * item.price}`, colX[3], y + 27);
    });

    ctx.strokeStyle = '#e6d9ce';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, totalsTop - 8);
    ctx.lineTo(1050, totalsTop - 8);
    ctx.stroke();

    ctx.fillStyle = '#222222';
    ctx.font = '600 22px Poppins, sans-serif';
    ctx.fillText(`Subtotal: ₹${subTotal()}`, 40, totalsTop + 34);
    ctx.fillText(`Delivery: ${deliveryCharge() === 0 ? 'FREE' : `₹${deliveryCharge()}`}`, 40, totalsTop + 68);
    ctx.fillStyle = '#d32f2f';
    ctx.font = '700 30px Poppins, sans-serif';
    ctx.fillText(`Total Amount Payable: ₹${totalBill()}`, 40, totalsTop + 118);
    ctx.fillStyle = '#666666';
    ctx.font = '500 18px Poppins, sans-serif';
    ctx.fillText('Delivery charge ₹20 below ₹300, free delivery on ₹300 and above.', 40, totalsTop + 154);

    if (rangeStatus === 'out-of-range') {
      ctx.fillStyle = '#b71c1c';
      ctx.font = '700 20px Poppins, sans-serif';
      ctx.fillText('Out of range order request - owner approval required.', 40, totalsTop + 186);
    }

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png', 0.95);
    });
  };

  const downloadBill = (blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `SVM-Bill-${Date.now()}.png`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const getCurrentPosition = () => new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ ok: false, reason: 'unsupported' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          ok: true,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => resolve({ ok: false, reason: 'denied' }),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });

  const placeOrder = async () => {
    if (!cart.length) {
      alert('Cart is empty. Please add products first.');
      showStep(1);
      return;
    }

    if (!receiver.name || !receiver.phone || !receiver.address) {
      showStep(2);
      alert('Please complete receiver details first.');
      return;
    }

    const paymentMode = getPaymentMode();
    if (paymentMode === 'online') {
      const senderUpi = senderUpiEl.value.trim();
      if (!senderUpi) {
        alert('Please enter your UPI ID after payment.');
        senderUpiEl.focus();
        return;
      }
    }

    const billBlob = await createBillImageBlob();
    if (!billBlob) {
      alert('Unable to generate bill image. Please try again.');
      return;
    }

    const billFile = new File([billBlob], `SVM-Bill-${Date.now()}.png`, { type: 'image/png' });

    const orderCaption = buildWhatsAppMessage();

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [billFile] })) {
      try {
        await navigator.share({
          title: 'Siddhi Vinayak Mart Bill',
          text: orderCaption,
          files: [billFile]
        });
        return;
      } catch {
      }
    }

    downloadBill(billBlob);
    alert('Direct image send is not supported on this browser/device. Bill image has been downloaded. WhatsApp owner chat will open — attach the image and tap Send.');
    window.location.href = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(orderCaption)}`;
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
      showStep(1);
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

  drawer.querySelector('#to-step-2').addEventListener('click', async () => {
    if (!cart.length) {
      alert('Please add products to cart first.');
      return;
    }

    const currentPosition = await getCurrentPosition();

    if (currentPosition.ok) {
      const km = distanceInKm(currentPosition.lat, currentPosition.lng, STORE_LOCATION.lat, STORE_LOCATION.lng);
      rangeDistanceKm = km;

      if (km <= SERVICE_RADIUS_KM) {
        rangeStatus = 'in-range';
        showStep(2);
        return;
      }

      rangeStatus = 'out-of-range';
      const allow = confirm(`You are ${km.toFixed(2)} km away from store (service range is ${SERVICE_RADIUS_KM} km).\n\nYou are currently out of range. Send out-of-range request to owner?`);
      if (!allow) {
        showStep(1);
        return;
      }

      alert('Out-of-range request noted. You can continue and send order for owner approval.');
      showStep(2);
      return;
    }

    rangeStatus = 'out-of-range';
    rangeDistanceKm = null;
    const allowWithoutLocation = confirm('Location access is not available. Continue as out-of-range request?');
    if (!allowWithoutLocation) {
      showStep(1);
      return;
    }

    alert('Continuing as out-of-range request.');
    showStep(2);
  });

  drawer.querySelector('#back-step-1').addEventListener('click', () => showStep(1));

  drawer.querySelector('#to-step-3').addEventListener('click', () => {
    if (!validateReceiverDetails()) return;
    showStep(3);
  });

  drawer.querySelector('#back-step-2').addEventListener('click', () => showStep(2));

  paymentModeEls.forEach((el) => el.addEventListener('change', togglePaymentUi));

  fab.addEventListener('click', () => {
    showStep(1);
    openCart();
  });
  overlay.addEventListener('click', closeCart);
  drawer.querySelector('.cart-close').addEventListener('click', closeCart);
  drawer.querySelector('#cart-clear').addEventListener('click', clearCart);
  drawer.querySelector('#cart-send').addEventListener('click', placeOrder);

  togglePaymentUi();
  showStep(1);
  render();
})();
