(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const grid = document.getElementById("homeGrid");
    if (grid && window.GM38) {
      grid.innerHTML = GM38.productsForCity().slice(0, 8).map(GM38.renderProductCard).join("");
      GM38.bindAddButtons(grid);
    }

    const revealNodes = document.querySelectorAll(
      ".reveal, .collection-grid .product-card, .experience__item, .city-row"
    );
    if (reduce) {
      revealNodes.forEach((node) => node.classList.add("is-in", "is-visible"));
      return;
    }

    if (!("IntersectionObserver" in window)) {
      revealNodes.forEach((node) => node.classList.add("is-in", "is-visible"));
      return;
    }

    revealNodes.forEach((node, index) => {
      node.classList.add("reveal");
      node.style.transitionDelay = `${Math.min(index % 5, 4) * 70}ms`;
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in", "is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealNodes.forEach((node) => io.observe(node));
  });
})();
