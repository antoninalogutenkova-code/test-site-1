(() => {
  const $ = (id) => document.getElementById(id);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Появление блоков при прокрутке (карточки создаются скриптом, поэтому следим за ними)
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      }, { threshold: 0.12 })
    : null;

  const watch = (el) => {
    if (!io || reduce) return el.classList.add("is-visible");
    if (!el.classList.contains("reveal")) {
      el.classList.add("reveal");
      io.observe(el);
    }
  };
  document.querySelectorAll(".section, .steps li").forEach(watch);
  const list = $("catalogList");
  const watchCards = () => list.querySelectorAll(".card").forEach(watch);
  watchCards();
  new MutationObserver(() => {
    list.querySelectorAll(".card:not(.reveal)").forEach((c) => {
      c.classList.add("is-visible");
      c.classList.add("reveal");
    });
  }).observe(list, { childList: true });

  // Плавающая панель заказа
  const dock = $("dock");
  const orderSection = $("order");
  let orderInView = false;
  const updateDock = () => {
    const filled = !$("cartBox").hidden;
    $("dockSum").textContent = `Заказ: ${$("totalSum").textContent}`;
    dock.classList.toggle("is-shown", filled && !orderInView);
  };
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      orderInView = entries[0].isIntersecting;
      updateDock();
    }).observe(orderSection);
  }
  new MutationObserver(updateDock).observe($("totalSum"), { childList: true, characterData: true, subtree: true });
  new MutationObserver(updateDock).observe($("cartBox"), { attributes: true, attributeFilter: ["hidden"] });
  updateDock();

  // Капля глазури - неожиданное подтверждение заказа вместо обычного попапа
  function icingDrip() {
    if (reduce) return;
    const layer = document.createElement("div");
    layer.className = "icing-layer";
    document.body.appendChild(layer);

    const count = 6;
    for (let i = 0; i < count; i++) {
      const drip = document.createElement("div");
      drip.className = "icing-drip";
      const h = 70 + Math.random() * 110;
      const x = 6 + (i / (count - 1)) * 88 + (Math.random() * 6 - 3);
      const fallDelay = Math.random() * 0.35;
      drip.style.left = `${x}vw`;
      drip.style.setProperty("--h", `${h}px`);
      drip.style.setProperty("--fall-delay", `${fallDelay}s`);
      drip.innerHTML = '<span class="icing-drip__tail"></span><span class="icing-drip__blob"></span>';
      layer.appendChild(drip);
    }

    setTimeout(() => layer.classList.add("is-fading"), 1500);
    setTimeout(() => layer.remove(), 2100);
  }
  document.addEventListener("sweet:order-confirmed", icingDrip);
})();
