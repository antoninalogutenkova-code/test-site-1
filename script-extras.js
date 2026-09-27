(() => {
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  function renderPhone(phone) {
    const digits = String(phone || "").replace(/[^\d+]/g, "");
    const has = digits.replace(/\D/g, "").length >= 6;
    for (const id of ["callHero", "callContacts"]) {
      const a = $(id);
      if (!a) continue;
      a.hidden = !has;
      if (has) {
        a.href = `tel:${digits}`;
        a.setAttribute("aria-label", `Позвонить: ${phone}`);
      }
    }
  }

  const dialog = $("lightbox");
  function openLightbox(src, caption) {
    $("lightboxImg").src = src;
    $("lightboxImg").alt = caption || "Фото работы";
    $("lightboxCap").textContent = caption || "";
    if (typeof dialog.showModal === "function") dialog.showModal();
  }
  $("lightboxClose").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });

  function renderGallery(items) {
    const list = $("galleryList");
    list.textContent = "";
    const ok = (items || []).filter((g) => g && g.image);
    $("gallery").hidden = ok.length === 0;
    for (const g of ok) {
      const li = el("li");
      const b = el("button");
      b.type = "button";
      b.setAttribute("aria-label", g.caption ? `Открыть фото: ${g.caption}` : "Открыть фото");
      const img = el("img");
      img.src = g.image;
      img.alt = g.caption || "Фото работы";
      img.loading = "lazy";
      b.appendChild(img);
      if (g.caption) b.appendChild(el("span", "cap", g.caption));
      b.addEventListener("click", () => openLightbox(g.image, g.caption));
      li.appendChild(b);
      list.appendChild(li);
    }
  }

  function renderReviews(items) {
    const list = $("reviewsList");
    list.textContent = "";
    const ok = (items || []).filter((r) => r && (r.text || r.image));
    $("reviews").hidden = ok.length === 0;
    for (const r of ok) {
      const li = el("li", "review");
      if (r.image) {
        const img = el("img");
        img.src = r.image;
        img.alt = r.name ? `Отзыв: ${r.name}` : "Отзыв клиента";
        img.loading = "lazy";
        li.appendChild(img);
      }
      if (r.text) li.appendChild(el("p", null, `«${r.text}»`));
      const who = el("div", "review__who", r.name || "Клиент");
      if (r.date) who.appendChild(el("small", null, r.date));
      li.appendChild(who);
      list.appendChild(li);
    }
  }

  window.renderExtras = (c) => {
    renderPhone(c.phone);
    renderGallery(c.gallery);
    renderReviews(c.reviews);
  };
  window.renderExtras(window.CONTENT || {});
})();
