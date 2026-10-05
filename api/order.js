// Приём заказа с сайта: отправляет уведомление в МАКС и на почту.
// Секреты лежат только в настройках Vercel (Environment Variables), не в коде:
//   MAX_BOT_TOKEN - токен бота МАКС
//   MAX_USER_ID   - числовой id получателя в МАКС (id Антонины)
//   MAIL_USER     - адрес на Mail.ru, с которого уходят письма
//   MAIL_PASS     - пароль для внешнего приложения (не основной пароль от почты)
//   MAIL_TO       - куда присылать заказы (по умолчанию тот же адрес, что MAIL_USER)
//   MAX_API_BASE  - необязательно, по умолчанию https://platform-api2.max.ru
const nodemailer = require("nodemailer");

const ALLOWED_ORIGINS = [
  "https://sweet7.tilda.ws",
  "https://ant-site.github.io",
  "https://test-site-1-steel.vercel.app",
  "https://test-site-1-ch58.vercel.app",
];

function cors(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

const clip = (v, n) => String(v ?? "").trim().slice(0, n);
const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function sendMax(message) {
  const { MAX_BOT_TOKEN, MAX_USER_ID } = process.env;
  if (!MAX_BOT_TOKEN || !MAX_USER_ID) return "skipped";
  const base = process.env.MAX_API_BASE || "https://platform-api2.max.ru";
  const r = await fetch(`${base}/messages?user_id=${encodeURIComponent(MAX_USER_ID)}`, {
    method: "POST",
    headers: { Authorization: MAX_BOT_TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify({ text: message.slice(0, 4000) }),
  });
  if (!r.ok) throw new Error(`MAX ${r.status}`);
  return "ok";
}

async function sendMail(subject, message) {
  const { MAIL_USER, MAIL_PASS } = process.env;
  if (!MAIL_USER || !MAIL_PASS) return "skipped";
  const transport = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: { user: MAIL_USER, pass: MAIL_PASS },
  });
  await transport.sendMail({
    from: MAIL_USER,
    to: process.env.MAIL_TO || MAIL_USER,
    subject,
    text: message,
    html: `<pre style="font:15px/1.5 sans-serif;white-space:pre-wrap">${escapeHtml(message)}</pre>`,
  });
  return "ok";
}

module.exports = async (req, res) => {
  cors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  const body = typeof req.body === "string" ? safeJson(req.body) : req.body || {};
  // Ловушка для ботов: настоящий посетитель это поле не видит и не заполняет.
  if (body.website) return res.status(200).json({ ok: true });

  const name = clip(body.name, 100);
  const phone = clip(body.phone, 40);
  const text = clip(body.text, 3000);
  if (!name || !phone || !text) return res.status(400).json({ ok: false, error: "empty" });

  const message = `Новый заказ с сайта «Сладости для радости»\n\n${text}`;
  const subject = `Новый заказ: ${name}, ${phone}`;

  const [max, mail] = await Promise.allSettled([sendMax(message), sendMail(subject, message)]);
  const status = {
    max: max.status === "fulfilled" ? max.value : "error",
    mail: mail.status === "fulfilled" ? mail.value : "error",
  };
  if (max.status === "rejected") console.error("max:", max.reason?.message);
  if (mail.status === "rejected") console.error("mail:", mail.reason?.message);

  const delivered = status.max === "ok" || status.mail === "ok";
  return res.status(delivered ? 200 : 502).json({ ok: delivered, ...status });
};

function safeJson(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
