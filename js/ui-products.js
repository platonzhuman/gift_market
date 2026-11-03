window.GM38 = window.GM38 || {};

GM38.renderProductCard = (product) => {
  const store = GM38.getStore(product.storeId);
  return `
  <article class="product-card">
    <a class="product-card__img" href="product.html?id=${encodeURIComponent(product.id)}">
      <img src="${product.image}" alt="${product.name}" loading="lazy" width="400" height="500" />
      <span class="product-card__float">${store ? store.name : "Ателье"}</span>
    </a>
    <div class="product-card__body">
      <div class="product-card__store">${store ? store.name : "Ателье"}</div>
      <h3><a href="product.html?id=${encodeURIComponent(product.id)}">${product.name}</a></h3>
      <div class="product-card__meta">${product.short}</div>
      <div class="product-card__footer">
        <div>
          <div class="price">${GM38.formatPrice(product.price)}</div>
          <span class="token-pill">${product.tokens} ток.</span>
        </div>
        <button class="btn btn--secondary btn--sm" type="button" data-add="${product.id}">В корзину</button>
      </div>
    </div>
  </article>`;
};

GM38.bindAddButtons = (root = document) => {
  root.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      GM38.addToCart(btn.getAttribute("data-add"), 1);
    });
  });
};
