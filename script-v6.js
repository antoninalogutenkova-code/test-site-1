(() => {
  const { CATALOG, SITE } = window;
  const cart = {};
  const rub = (n) => `${n.toLocaleString("ru-RU")} ₽`;
  const $ = (id) => document.getElementById(id);

  $("vkWrite").href = SITE.vkChatUrl;
  $("vkGroup").href = SITE.vkCommunityUrl;
  $("year").textContent = new Date().getFullYear();

  function renderCatalog() {
    const list = $("catalogList");
    list.textContent = "";
    for (const p of CATALOG) {
      const li = document.createElement("li");
      li.className = "card";

      const pic = document.createElement("div");
      pic.className = "card__pic";
      pic.setAttribute("aria-hidden", "true");
      if (p.image) {
        const img = document.createElement("img");
        img.src = p.image;
        img.alt = p.name;
        pic.appendChild(img);
        pic.removeAttribute("aria-hidden");
        if (!p.ownPhoto) {
          const badge = document.createElement("span");
          badge.className = "card__photo-note";
          badge.textContent = "фото для примера";
          pic.appendChild(badge);
        }
      } else {
        pic.classList.add("card__pic--placeholder");
        const note = document.createElement("span");
        note.className = "card__placeholder-note";
        note.textContent = "Фото скоро добавим";
        pic.appendChild(note);
      }

      const title = document.createElement("h3");
      title.textContent = p.name;
      const desc = document.createElement("p");
      desc.textContent = p.description;
      const price = document.createElement("p");
      price.className = "card__price";
      price.textContent = `${rub(p.price)} / ${p.unit}`;

      const actions = document.createElement("div");
      actions.className = "card__actions";
      actions.appendChild(actionFor(p));

      li.append(pic, title, desc, price, actions);
      list.appendChild(li);
    }
  }

  function actionFor(p) {
    const qty = cart[p.id] || 0;
    if (!qty) {
      const add = document.createElement("button");
      add.type = "button";
      add.className = "btn btn--primary";
      add.textContent = "В заказ";
      add.addEventListener("click", () => change(p.id, 1));
      return add;
    }
    const box = document.createElement("div");
    box.className = "qty";
    const minus = document.createElement("button");
    minus.type = "button";
    minus.setAttribute("aria-label", `Убрать: ${p.name}`);
    minus.textContent = "−";
    minus.addEventListener("click", () => change(p.id, -1));
    const out = document.createElement("output");
    out.textContent = `${qty} ${p.unit}`;
    const plus = document.createElement("button");
    plus.type = "button";
    plus.setAttribute("aria-label", `Добавить: ${p.name}`);
    plus.textContent = "+";
    plus.addEventListener("click", () => change(p.id, 1));
    box.append(minus, out, plus);
    return box;
  }

  function change(id, delta) {
    const next = Math.max(0, Math.min(50, (cart[id] || 0) + delta));
    if (next) cart[id] = next;
    else delete cart[id];
    $("result").hidden = true;
    renderCatalog();
    renderCart();
  }

  function items() {
    return CATALOG.filter((p) => cart[p.id]).map((p) => ({ ...p, qty: cart[p.id] }));
  }

  function renderCart() {
    const list = items();
    const total = list.reduce((s, p) => s + p.price * p.qty, 0);
    $("emptyCart").hidden = list.length > 0;
    $("cartBox").hidden = list.length === 0;
    const ul = $("cartList");
    ul.textContent = "";
    for (const p of list) {
      const li = document.createElement("li");
      const left = document.createElement("span");
      left.textContent = `${p.name} - ${p.qty} ${p.unit} × ${rub(p.price)}`;
      const right = document.createElement("strong");
      right.textContent = rub(p.qty * p.price);
      li.append(left, right);
      ul.appendChild(li);
    }
    $("totalSum").textContent = rub(total);
  }

  function orderText(form) {
    const list = items();
    const total = list.reduce((s, p) => s + p.price * p.qty, 0);
    const lines = [
      ...list.map((p) => `• ${p.name}: ${p.qty} ${p.unit} × ${rub(p.price)} = ${rub(p.qty * p.price)}`),
      "",
      `Итого: ${rub(total)}`,
      `Имя: ${form.name.value.trim()}`,
      `Телефон: ${form.phone.value.trim()}`,
    ];
    const comment = form.comment.value.trim();
    if (comment) lines.push(`Комментарий: ${comment}`);
    return lines.join("\n");
  }

  $("orderForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const err = $("formError");
    if (!items().length) return;
    if (!form.name.value.trim() || !form.phone.value.trim()) {
      err.textContent = "Пожалуйста, укажите имя и телефон.";
      err.hidden = false;
      return;
    }
    err.hidden = true;

    const text = orderText(form);
    $("orderText").value = text;
    $("openChat").href = SITE.vkChatUrl;
    $("result").hidden = false;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      $("orderText").select();
    }
    window.open(SITE.vkChatUrl, "_blank", "noopener");
    $("result").scrollIntoView({ behavior: "smooth", block: "nearest" });
    document.dispatchEvent(new CustomEvent("sweet:order-confirmed"));
  });

  renderCatalog();
  renderCart();
})();
