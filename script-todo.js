(() => {
  const content = window.CONTENT || {};
  if (!content.showTodo) return;

  const mk = (text, extra) => {
    const s = document.createElement("span");
    s.className = `todo${extra ? " " + extra : ""}`;
    s.textContent = text;
    return s;
  };
  const $ = (id) => document.getElementById(id);

  // Пояснение вверху страницы
  const legend = document.createElement("div");
  legend.className = "todo-legend";
  const b = document.createElement("strong");
  b.textContent = "Черновик. ";
  legend.append(b, "Жёлтые пометки показывают, где нужно внести или заменить данные. Когда всё готово, в файле content-final.js поставьте showTodo: false.");
  document.body.prepend(legend);

  // Главное фото сверху
  $("callHero") && document.querySelector(".hero__img")?.after(mk("замените это фото на своё (сейчас фото для примера)"));

  // Карточки каталога (перерисовываются при изменении корзины, поэтому следим)
  const list = $("catalogList");
  const markCards = () => {
    [...list.querySelectorAll(".card")].forEach((card, i) => {
      if (card.querySelector(".todo")) return;
      const product = (window.CATALOG || [])[i];
      const actions = card.querySelector(".card__actions");
      if (product && product.ownPhoto === false) {
        actions.before(mk("фото для примера: замените на своё", "todo--card"));
      }
      actions.before(mk("состав, вес и начинку в описании", "todo--card"));
    });
  };
  markCards();
  new MutationObserver(markCards).observe(list, { childList: true });

  // Галерея
  const gList = $("galleryList");
  const gLi = document.createElement("li");
  gLi.appendChild(mk("добавьте ещё фото своих работ (в папку images и в content-final.js)"));
  gList.after(gLi.firstChild);

  // Отзывы: показываем блок-заглушку, пока нет настоящих
  const reviews = $("reviews");
  if ((content.reviews || []).length === 0) {
    reviews.hidden = false;
    $("reviewsList").after(mk("настоящие отзывы клиентов: имя и текст (или скриншот)"));
  }

  // Доставка
  const delivery = [...document.querySelectorAll("p.muted")].find((p) => p.textContent.includes("Доставку"));
  if (delivery) delivery.after(mk("условия доставки и самовывоза: адрес самовывоза, стоимость доставки, за сколько дней заказывать"));

  // О нас
  const about = document.querySelector('[aria-labelledby="aboutTitle"] p');
  if (about) about.after(mk("расскажите о себе: с какого времени печёте, чем гордитесь, из чего делаете"));

  // Контакты
  const actions = document.querySelector("#vkWrite")?.parentElement;
  if (actions) actions.after(mk("город или район, другие способы связи (Telegram, WhatsApp), время работы"));
})();
