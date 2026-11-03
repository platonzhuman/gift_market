window.GM38 = window.GM38 || {};

const STORAGE_KEY = "gm38-demo-v1";

function defaultState() {
  return {
    cityId: "irkutsk",
    cart: [],
    subscription: null,
    tokenBalance: 0,
    weeklyRedeemedIds: [],
    orders: [],
  };
}

GM38.state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(GM38.state));
  GM38.updateChrome();
}

GM38.getCity = () => GM38.CITIES.find((c) => c.id === GM38.state.cityId) || GM38.CITIES[0];

GM38.getStore = (id) => GM38.STORES.find((s) => s.id === id);

GM38.getProduct = (id) => GM38.PRODUCTS.find((p) => p.id === id);

GM38.productsForCity = (cityId = GM38.state.cityId) =>
  GM38.PRODUCTS.filter((p) => p.cities.includes(cityId));

GM38.formatPrice = (n) => `${Number(n).toLocaleString("ru-RU")} ₽`;

GM38.cartCount = () => GM38.state.cart.reduce((sum, i) => sum + i.qty, 0);

GM38.cartTotal = () =>
  GM38.state.cart.reduce((sum, i) => {
    const p = GM38.getProduct(i.productId);
    return sum + (p ? p.price * i.qty : 0);
  }, 0);

GM38.setCity = (cityId) => {
  if (!GM38.CITIES.some((c) => c.id === cityId)) return;
  GM38.state.cityId = cityId;
  // Drop cart lines unavailable in new city
  GM38.state.cart = GM38.state.cart.filter((item) => {
    const p = GM38.getProduct(item.productId);
    return p && p.cities.includes(cityId);
  });
  saveState();
  document.dispatchEvent(new CustomEvent("gm38:city"));
};

GM38.addToCart = (productId, qty = 1) => {
  const product = GM38.getProduct(productId);
  if (!product || !product.cities.includes(GM38.state.cityId)) {
    GM38.toast("Товар недоступен в выбранном городе");
    return false;
  }
  const existing = GM38.state.cart.find((i) => i.productId === productId);
  if (existing) existing.qty += qty;
  else GM38.state.cart.push({ productId, qty });
  saveState();
  GM38.toast("Добавлено в корзину");
  return true;
};

GM38.setCartQty = (productId, qty) => {
  const item = GM38.state.cart.find((i) => i.productId === productId);
  if (!item) return;
  if (qty <= 0) GM38.state.cart = GM38.state.cart.filter((i) => i.productId !== productId);
  else item.qty = qty;
  saveState();
};

GM38.clearCart = () => {
  GM38.state.cart = [];
  saveState();
};

GM38.subscribe = (planId) => {
  const plan = GM38.PLANS[planId];
  if (!plan) return false;
  GM38.state.subscription = {
    planId: plan.id,
    name: plan.name,
    price: plan.price,
    startedAt: new Date().toISOString(),
  };
  GM38.state.tokenBalance = plan.tokens;
  GM38.state.weeklyRedeemedIds = [];
  saveState();
  return true;
};

GM38.redeemWithTokens = (productId) => {
  const product = GM38.getProduct(productId);
  if (!product) return { ok: false, message: "Товар не найден" };
  if (!product.cities.includes(GM38.state.cityId)) {
    return { ok: false, message: "Нет в вашем городе" };
  }
  if (!GM38.state.subscription) {
    return { ok: false, message: "Сначала оформите подписку" };
  }
  if (GM38.state.tokenBalance < product.tokens) {
    return { ok: false, message: "Не хватает токенов" };
  }
  GM38.state.tokenBalance -= product.tokens;
  GM38.state.weeklyRedeemedIds.push(productId);
  GM38.state.orders.unshift({
    id: `tok-${Date.now()}`,
    type: "tokens",
    productId,
    tokens: product.tokens,
    cityId: GM38.state.cityId,
    at: new Date().toISOString(),
  });
  saveState();
  return { ok: true };
};

GM38.placeOrder = ({ name, phone, address, payMethod }) => {
  if (!GM38.state.cart.length) return null;
  const order = {
    id: `ord-${Date.now()}`,
    type: "cart",
    items: GM38.state.cart.map((i) => ({ ...i })),
    total: GM38.cartTotal(),
    cityId: GM38.state.cityId,
    name,
    phone,
    address,
    payMethod,
    at: new Date().toISOString(),
  };
  GM38.state.orders.unshift(order);
  GM38.state.cart = [];
  saveState();
  return order;
};

GM38.toast = (message) => {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("is-on");
  clearTimeout(GM38._toastTimer);
  GM38._toastTimer = setTimeout(() => el.classList.remove("is-on"), 2200);
};

GM38.updateChrome = () => {
  const city = GM38.getCity();
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    const count = GM38.cartCount();
    el.textContent = String(count);
    el.style.display = count > 0 ? "inline-flex" : "none";
  });
  document.querySelectorAll("[data-city-label]").forEach((el) => {
    el.textContent = city.name;
  });
  document.querySelectorAll("[data-token-balance]").forEach((el) => {
    el.textContent = String(GM38.state.tokenBalance);
  });
  document.querySelectorAll("select[data-city-select]").forEach((sel) => {
    sel.value = GM38.state.cityId;
  });
};

GM38.mountChrome = () => {
  document.querySelectorAll("select[data-city-select]").forEach((sel) => {
    sel.innerHTML = GM38.CITIES.map(
      (c) => `<option value="${c.id}">${c.name}</option>`
    ).join("");
    sel.value = GM38.state.cityId;
    sel.addEventListener("change", () => {
      GM38.setCity(sel.value);
      // Reload listing pages so assortment refreshes
      if (document.body.dataset.reloadOnCity === "true") {
        location.reload();
      }
    });
  });

  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-nav-panel]");
  if (toggle && panel) {
    toggle.addEventListener("click", () => {
      const open = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      document.body.classList.toggle("nav-open", open);
    });
  }

  GM38.updateChrome();
};

document.addEventListener("DOMContentLoaded", () => {
  GM38.mountChrome();
});
