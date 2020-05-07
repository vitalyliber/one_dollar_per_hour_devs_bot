const Telegraf = require("telegraf");
const session = require("telegraf/session");

const helpText =
  "Начать снова /start\nУбрать резюме из поиска /hide\nПоказать резюме в поиске /show";

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());
bot.start((ctx) => {
  session.step = "username";
  ctx.reply(
    "Привет джуниор разработчик! \nНет опыта? Ты в правильном месте. Регистрируйся и получи шанс найти работу за 1 доллар в час.\n\nВведи имя и фамилию для резюме (1/3 шагов | /stop чтобы прервать)"
  );
});
bot.help((ctx) => ctx.reply(helpText));
bot.on("text", (ctx) => {
  if (ctx.message.text === "/stop") {
    session.step = null;
    return ctx.reply("Работа с профилем приостановлена. Спасибо!");
  }
  if (session.step === "username") {
    if (ctx.message.text.length > 6) {
      // update username
      console.log(
        ctx.message.text,
        ctx.message.from.id,
        ctx.message.from.username
      );
      session.step = "stack";
      return ctx.reply(
        "Введи список технологий, которыми вы владеете (2/3 шагов | /stop чтобы прервать)"
      );
    } else {
      return ctx.reply("Попробуй ввести имя пользователя снова");
    }
  }
  if (session.step === "stack") {
    if (ctx.message.text.length > 6) {
      // update stack
      console.log(
        ctx.message.text,
        ctx.message.from.id,
        ctx.message.from.username
      );
      session.step = "experience";
      return ctx.reply(
        "Расскажи о вашем опыте разработки и/или о курсах, которые ты прошел (3/3 шагов | /stop чтобы прервать)"
      );
    } else {
      return ctx.reply("Попробуй ввести список технологий снова");
    }
  }
  if (session.step === "experience") {
    if (ctx.message.text.length > 6) {
      // update stack
      console.log(
        ctx.message.text,
        ctx.message.from.id,
        ctx.message.from.username
      );
      session.step = null;
      return ctx.reply(
        "Спасибо за регистрацию! Ваше резюме доступно тут juniors.casply.com. /help"
      );
    } else {
      return ctx.reply("Попробуй отправить сообщение об опыте/курсах снова");
    }
  }
  if (!session.step) {
    return ctx.reply(helpText);
  }
});
// bot.use(stage.middleware())
bot.launch();
