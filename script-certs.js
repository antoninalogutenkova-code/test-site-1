(() => {
  const $ = (id) => document.getElementById(id);
  const items = ((window.CONTENT || {}).certificates || []).filter((c) => c && c.image);
  const section = $("certs");
  if (!section) return;
  section.hidden = items.length === 0;

  const dialog = $("lightbox");
  const list = $("certsList");
  list.textContent = "";
  for (const c of items) {
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", c.caption ? `Открыть сертификат: ${c.caption}` : "Открыть сертификат");
    const img = document.createElement("img");
    img.src = c.image;
    img.alt = c.caption || "Сертификат";
    img.loading = "lazy";
    b.appendChild(img);
    if (c.caption) {
      const cap = document.createElement("span");
      cap.className = "cap";
      cap.textContent = c.caption;
      b.appendChild(cap);
    }
    b.addEventListener("click", () => {
      $("lightboxImg").src = c.image;
      $("lightboxImg").alt = c.caption || "Сертификат";
      $("lightboxCap").textContent = c.caption || "";
      if (typeof dialog.showModal === "function") dialog.showModal();
    });
    li.appendChild(b);
    list.appendChild(li);
  }
})();
