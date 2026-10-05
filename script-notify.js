// Тихо отправляет заказ на сервер, чтобы он пришёл владельцу в МАКС и на почту.
// Если сервер не ответил, ничего не ломается: заказ всё равно уходит через чат ВК.
(() => {
  const ENDPOINT = "https://test-site-1-ch58.vercel.app/api/order";

  document.addEventListener("sweet:order-confirmed", () => {
    const form = document.getElementById("orderForm");
    const text = document.getElementById("orderText").value;
    if (!form || !text) return;
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.value,
        phone: form.phone.value,
        text,
        website: form.website ? form.website.value : "",
      }),
      keepalive: true,
    }).catch(() => {});
  });
})();
