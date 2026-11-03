(function () {
  const page = document.body.dataset.page || "";
  const active = (id) => (page === id ? "is-active" : "");

  const header = `
  <div class="demo-bar"><strong>DEMO</strong> · без реальных платежей · магазины вымышленные</div>
  <header class="topnav" id="topnav">
    <div class="container topnav__inner">
      <a class="logo" href="index.html">Gift Market <span>38</span></a>
      <nav class="nav-desktop" aria-label="Основное меню">
        <a href="catalog.html">Коллекция</a>
        <a href="subscription.html">Подписка</a>
        <a href="weekly.html">Неделя</a>
      </nav>
      <div class="topnav__right">
        <label class="visually-hidden" for="citySelectTop">Город</label>
        <select class="city-select" id="citySelectTop" data-city-select aria-label="Город доставки"></select>
        <a class="icon-btn" href="cart.html" aria-label="Корзина">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6l-1-3H2"/><circle cx="9" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/></svg>
          <span class="badge" data-cart-count>0</span>
        </a>
        <button class="nav-toggle" type="button" data-nav-toggle aria-label="Меню" aria-expanded="false"><span></span></button>
      </div>
    </div>
  </header>
  <div class="nav-panel" data-nav-panel aria-hidden="true">
    <a href="index.html">Главная</a>
    <a href="catalog.html">Коллекция</a>
    <a href="subscription.html">Подписка</a>
    <a href="weekly.html">Неделя</a>
    <a href="cart.html">Корзина</a>
    <p class="muted">Город: <span data-city-label></span> · токены: <span data-token-balance>0</span></p>
  </div>`;

  const bottom = `
  <nav class="bottom-nav" aria-label="Мобильная навигация">
    <a class="${active("home")}" href="index.html">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z"/></svg>
      Ателье
    </a>
    <a class="${active("catalog")}" href="catalog.html">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h16M4 12h16M4 17h10"/></svg>
      Каталог
    </a>
    <a class="${active("subscription")}" href="subscription.html">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="7.5"/><path d="M12 8.5v7M9.5 10.8h5M9.5 13.2h5"/></svg>
      Подписка
    </a>
    <a class="${active("cart")}" href="cart.html">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6l-1-3H2"/><circle cx="9" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/></svg>
      Корзина
    </a>
  </nav>`;

  const mount = document.querySelector("[data-chrome]");
  if (mount) mount.innerHTML = header + bottom;

  window.addEventListener("scroll", () => {
    document.getElementById("topnav")?.classList.toggle("is-scrolled", window.scrollY > 12);
  }, { passive: true });
})();
