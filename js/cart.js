/* ==========================================
   CART STORAGE KEY
========================================== */

const CART_KEY = "tawang_cafe_cart";

/* ==========================================
   CART STATE
========================================== */

let cart = loadCart();

/* ==========================================
   LOAD CART
========================================== */

function loadCart() {

  try {

    const saved =
      localStorage.getItem(CART_KEY);

    return saved
      ? JSON.parse(saved)
      : [];

  } catch {

    return [];

  }

}

/* ==========================================
   SAVE CART
========================================== */

function saveCart() {

  localStorage.setItem(
    CART_KEY,
    JSON.stringify(cart)
  );

}

/* ==========================================
   GET CART
========================================== */

export function getCart() {

  return cart;

}

/* ==========================================
   CLEAR CART
========================================== */

export function clearCart() {

  cart = [];

  saveCart();

}

/* ==========================================
   ADD ITEM
========================================== */

export function addToCart(item) {

  const existing =
    cart.find(
      product => product.id === item.id
    );

  if (existing) {

    existing.quantity += 1;

  } else {

    cart.push({
      ...item,
      quantity: 1
    });

  }

  saveCart();

  notifyCartChanged();

}

/* ==========================================
   REMOVE ITEM
========================================== */

export function removeFromCart(id) {

  cart =
    cart.filter(
      item => item.id !== id
    );

  saveCart();

  notifyCartChanged();

}

/* ==========================================
   INCREASE
========================================== */

export function increaseQty(id) {

  const item =
    cart.find(
      item => item.id === id
    );

  if (!item) return;

  item.quantity++;

  saveCart();

  notifyCartChanged();

}

/* ==========================================
   DECREASE
========================================== */

export function decreaseQty(id) {

  const item =
    cart.find(
      item => item.id === id
    );

  if (!item) return;

  item.quantity--;

  if (item.quantity <= 0) {

    removeFromCart(id);

    return;
  }

  saveCart();

  notifyCartChanged();

}

/* ==========================================
   ITEM COUNT
========================================== */

export function getItemCount() {

  return cart.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  );

}

/* ==========================================
   SUBTOTAL
========================================== */

export function getSubtotal() {

  return cart.reduce(
    (sum, item) =>
      sum +
      (item.price * item.quantity),
    0
  );

}

/* ==========================================
   DELIVERY
========================================== */

export function getDeliveryFee() {

  const subtotal =
    getSubtotal();

  if (subtotal === 0) {

    return 0;

  }

  if (subtotal >= 500) {

    return 0;

  }

  return 40;

}

/* ==========================================
   GRAND TOTAL
========================================== */

export function getGrandTotal() {

  return (
    getSubtotal() +
    getDeliveryFee()
  );

}

/* ==========================================
   FIND ITEM
========================================== */

export function getCartItem(id) {

  return cart.find(
    item => item.id === id
  );

}

/* ==========================================
   CART EVENT
========================================== */

function notifyCartChanged() {

  window.dispatchEvent(
    new CustomEvent(
      "cartUpdated",
      {
        detail: cart
      }
    )
  );

}

/* ==========================================
   ORDER ITEMS FORMAT
========================================== */

export function getOrderItems() {

  return cart.map(item => ({
    id: item.id,
    name: item.name,
    price: Number(item.price),
    quantity: Number(item.quantity)
  }));

}

/* ==========================================
   CART SUMMARY
========================================== */

export function getCartSummary() {

  return {

    items: getOrderItems(),

    itemCount:
      getItemCount(),

    subtotal:
      getSubtotal(),

    deliveryFee:
      getDeliveryFee(),

    total:
      getGrandTotal()

  };

}
