(function () {
  const page = document.body.dataset.page || "";
  const active = (id) => (page === id ? "is-active" : "");

  const header = `
  <div class="ambient" aria-hidden="true">
    <span class="ambient__blob ambient__blob--rose"></span>
    <span class="ambient__blob ambient__blob--sage"></span>
    <span class="ambient__blob ambient__blob--gold"></span>
  </div>
  <header class="topnav" id="topnav">
    <div class="container topnav__inner">
      <a class="logo" href="index.html" aria-label="Gift Market 38 — на главную">
        <span class="logo__mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35">
            <circle cx="12" cy="7.8" r="3.2"/>
            <circle cx="12" cy="16.2" r="3.2"/>
            <circle cx="7.8" cy="12" r="3.2"/>
            <circle cx="16.2" cy="12" r="3.2"/>
            <circle cx="12" cy="12" r="1.15" fill="currentColor" stroke="none"/>
          </svg>
        </span>
        <span class="logo__text">Gift Market <b>38</b></span>
      </a>
      <nav class="nav-desktop" aria-label="Основное меню">
        <a class="${active("catalog")}" href="catalog.html">Коллекция</a>
        <a class="${active("subscription")}" href="subscription.html">Подписка</a>
        <a href="weekly.html">Неделя</a>
      </nav>
      <div class="topnav__right">
        <label class="visually-hidden" for="citySelectTop">Город доставки</label>
        <span class="city-field">
          <svg class="city-field__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
            <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"/>
            <circle cx="12" cy="10" r="2.4"/>
          </svg>
          <select class="city-select" id="citySelectTop" data-city-select aria-label="Город доставки"></select>
        </span>
        <a class="icon-btn" href="cart.html" aria-label="Корзина">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 7h16l-1.4 10.5a2 2 0 0 1-2 1.5H7.4a2 2 0 0 1-2-1.5L4 7z"/><path d="M8.5 7V5.8a3.5 3.5 0 0 1 7 0V7"/></svg>
          <span class="badge" data-cart-count>0</span>
        </a>
      </div>
    </div>
  </header>`;

  const bottom = `
  <nav class="bottom-nav" aria-label="Мобильная навигация">
    <a class="${active("home")}" href="index.html">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z"/></svg>
      <span>Ателье</span>
    </a>
    <a class="${active("catalog")}" href="catalog.html">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>
      <span>Каталог</span>
    </a>
    <a class="${active("subscription")}" href="subscription.html">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="7.5"/><path d="M12 8.5v7M9.5 10.8h5M9.5 13.2h5"/></svg>
      <span>Подписка</span>
    </a>
    <a class="${active("cart")}" href="cart.html">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 7h16l-1.4 10.5a2 2 0 0 1-2 1.5H7.4a2 2 0 0 1-2-1.5L4 7z"/><path d="M8.5 7V5.8a3.5 3.5 0 0 1 7 0V7"/></svg>
      <span>Корзина</span>
    </a>
  </nav>`;

  const mount = document.querySelector("[data-chrome]");
  if (mount) mount.innerHTML = header + bottom;
  document.querySelectorAll(".bottom-nav a.is-active, .nav-desktop a.is-active").forEach((link) => {
    link.setAttribute("aria-current", "page");
  });

  window.addEventListener("scroll", () => {
    document.getElementById("topnav")?.classList.toggle("is-scrolled", window.scrollY > 12);
  }, { passive: true });
})();
