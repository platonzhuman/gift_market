(() => {
  const plans = {
    start: { tokens: 24, label: "Старт" },
    rhythm: { tokens: 36, label: "Ритм" },
    always: { tokens: 55, label: "Всегда" },
    gift3: { tokens: 72, label: "Подарок 3 мес" },
  };

  const catalog = [
    { name: "Открытка / мини-комплимент", min: 3, max: 5 },
    { name: "Мини-букет (7–11 стеблей)", min: 12, max: 15 },
    { name: "Средний букет", min: 22, max: 28 },
    { name: "Мягкая игрушка / набор", min: 10, max: 18 },
    { name: "Комбо «цветы + открытка»", min: 16, max: 20 },
  ];

  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const planSelect = document.getElementById("planSelect");
  const tokenCount = document.getElementById("tokenCount");
  const tokenRub = document.getElementById("tokenRub");
  const affordList = document.getElementById("affordList");
  const priceCards = document.querySelectorAll(".price-card");
  const splitBar = document.getElementById("splitBar");
  const gmvChart = document.getElementById("gmvChart");

  function formatRub(n) {
    return `${n.toLocaleString("ru-RU")} ₽`;
  }

  function renderCalculator(planKey) {
    const plan = plans[planKey] || plans.start;
    tokenCount.textContent = String(plan.tokens);
    tokenRub.textContent = `= ${formatRub(plan.tokens * 100)} номинала`;

    affordList.innerHTML = catalog
      .map((item) => {
        const affordable = plan.tokens >= item.min;
        const status = affordable
          ? plan.tokens >= item.max
            ? "хватает полностью"
            : "хватает на нижнюю границу"
          : "не хватает токенов";
        return `<li class="${affordable ? "is-affordable" : "is-over"}">
          <span>${item.name}</span>
          <span>${item.min}–${item.max} ток. · ${status}</span>
        </li>`;
      })
      .join("");
  }

  function setActivePlan(planKey) {
    planSelect.value = planKey;
    priceCards.forEach((card) => {
      const active = card.dataset.plan === planKey;
      card.classList.toggle("is-active", active);
      card.classList.toggle("is-featured", active);
    });
    renderCalculator(planKey);
  }

  priceCards.forEach((card) => {
    const activate = () => setActivePlan(card.dataset.plan);
    card.addEventListener("click", activate);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });
  });

  planSelect.addEventListener("change", () => setActivePlan(planSelect.value));
  setActivePlan("start");

  window.addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 12);
    },
    { passive: true }
  );

  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.querySelectorAll(".nav__links a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  const animObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-inview");
        animObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.35 }
  );

  if (splitBar) animObserver.observe(splitBar);
  if (gmvChart) {
    gmvChart.querySelectorAll(".chart__col").forEach((col) => animObserver.observe(col));
  }
})();
