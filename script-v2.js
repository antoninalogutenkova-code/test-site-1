(() => {
  const $ = (id) => document.getElementById(id);
  const content = window.CONTENT || {};
  const site = window.SITE || {};

  // Телефон: все дополнительные кнопки «Позвонить» и текст с номером
  const digits = String(content.phone || "").replace(/[^\d+]/g, "");
  const has = digits.replace(/\D/g, "").length >= 6;
  for (const id of ["callFab", "callDock", "callOrder", "callResult"]) {
    const a = $(id);
    if (!a) continue;
    a.hidden = !has;
    if (has) {
      a.href = `tel:${digits}`;
      a.setAttribute("aria-label", `Позвонить: ${content.phone}`);
    }
  }
  for (const n of document.querySelectorAll("[data-phone]")) {
    n.textContent = content.phone || "";
    n.closest("[data-phone-box]")?.toggleAttribute("hidden", !has);
  }

  // Ссылка на сообщество в блоке «О нас»
  if ($("vkGroupAbout") && site.vkCommunityUrl) $("vkGroupAbout").href = site.vkCommunityUrl;
})();
