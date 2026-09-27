(() => {
  const $ = (id) => document.getElementById(id);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Счётчик дней до даты приёма заказов
  const target = new Date(2026, 10, 1); // 1 ноября 2026
  const box = $("countdown");
  const days = Math.ceil((target - new Date()) / 86400000);
  if (box) {
    if (days > 0) {
      const n = days % 100;
      const last = days % 10;
      const word = n > 10 && n < 15 ? "дней" : last === 1 ? "день" : last >= 2 && last <= 4 ? "дня" : "дней";
      $("countdownNum").textContent = days;
      $("countdownWord").textContent = word;
    } else {
      box.hidden = true;
    }
  }

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

  // Конфетти из сладостей после оформления заказа
  function confetti() {
    if (reduce) return;
    const icons = ["🍰", "🧁", "🍓", "🍒", "🍫", "🍬", "✨", "🎂"];
    for (let i = 0; i < 26; i++) {
      const s = document.createElement("span");
      s.className = "confetti";
      s.textContent = icons[i % icons.length];
      s.style.left = `${Math.random() * 100}vw`;
      s.style.animationDuration = `${2.2 + Math.random() * 2}s`;
      s.style.animationDelay = `${Math.random() * 0.6}s`;
      s.style.fontSize = `${20 + Math.random() * 20}px`;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 5200);
    }
  }
  $("orderForm").addEventListener("submit", () => {
    const f = $("orderForm");
    if (f.name.value.trim() && f.phone.value.trim()) confetti();
  });
})();
