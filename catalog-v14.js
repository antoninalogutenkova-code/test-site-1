// Каталог. ownPhoto: true = это ваше настоящее фото; false = фото для примера.
// Если image не указан - на карточке будет мягкая заглушка с текстом "Фото скоро добавим".
// allergens: готовая строка для показа покупателю (пишите её целиком, с нужным вводным словом).
// needsReview: true - строка ещё не подтверждена Антониной, показывается с жёлтой пометкой.
// Все 5 позиций подтверждены Антониной 29.09.2026.
window.CATALOG = [
  {
    id: "korp-pp", image: "images/own-korp-pp-fruits-2.jpg", ownPhoto: true,
    name: "Корпусное пирожное ПП", description: "ПП-вариант", price: 500, unit: "шт",
    allergens: "Без глютена, без сахара, без лактозы, без орехов и миндаля. Содержит яйца (белок или целое яйцо - зависит от партии).", needsReview: false,
  },
  {
    id: "korp-classic", image: "images/korp-apple.jpg", ownPhoto: true,
    name: "Корпусное пирожное Классика", description: "Классический вариант", price: 400, unit: "шт",
    allergens: "Содержит: глютен (пшеница), яйца, молочные продукты.", needsReview: false,
  },
  {
    id: "bento", image: "images/bento.jpg", ownPhoto: true,
    name: "Бенто-торт", description: "Небольшой торт", price: 1900, unit: "шт",
    allergens: "Содержит: глютен (пшеница), яйца, молочные продукты.", needsReview: false,
  },
  {
    id: "roll-biscuit", image: "images/roll-biscuit-real.jpg", ownPhoto: true,
    name: "Рулет бисквитный", description: "Цена за 1 кг", price: 2300, unit: "кг",
    allergens: "Содержит: глютен (пшеница), яйца, молочные продукты.", needsReview: false,
  },
  {
    id: "roll-meringue", image: "images/own-roll-meringue-trees-2.jpg", ownPhoto: true,
    name: "Рулет меринговый", description: "Цена за 1 кг", price: 2700, unit: "кг",
    allergens: "Содержит: яичный белок, молочные продукты.", needsReview: false,
  },
];

window.SITE = {
  name: "Сладости для радости",
  vkChatUrl: "https://vk.me/club241709593",
  vkCommunityUrl: "https://vk.com/club241709593",
};
