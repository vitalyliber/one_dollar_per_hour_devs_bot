const updateUserAvatar = require("./api/updateUserAvatar");
const createOrUpdateUser = require("./api/createOrUpdateUser");
const updateMainPage = require("./api/updateMainPage");
const getProfile = require("./api/getProfile");

require("dotenv").config();
const Telegraf = require("telegraf");
const session = require("telegraf/session");

const baseUrl = "https://juniors.casply.com";
const helpText =
  "🔆 Начать снова /start\n✅ Показать резюме в поиске /show\n🤳 Чтобы обновить фото отправьте его в чат\n❌ Убрать резюме из поиска /hide\n";

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());
bot.start((ctx) => {
  session.step = "username";
  ctx.reply(
    "Привет джуниор разработчик!\nНет опыта разработки? 🥺\nНо есть сильное желание прокачаться?🤓\nРегистрируйся и получи шанс найти работу за 1 доллар в час 💵\n\nВведи имя и фамилию для резюме (1/3 шагов | /stop чтобы прервать)"
  );
});
bot.help((ctx) => ctx.reply(helpText));
bot.command("hide", async (ctx) => {
  const data = {
    junior_user: {
      telegram_id: ctx.message.from.id,
      active: false,
    },
  };
  createOrUpdateUser(data);
  ctx.reply(`Профиль был скрыт ${baseUrl}`);
  updateMainPage();
});
bot.command("show", async (ctx) => {
  const profile = await getProfile({ telegram_id: ctx.message.from.id });
  if (!profile.image) {
    return ctx.reply(`Загрузите фото, чтобы отпрыть профиль`);
  }
  const data = {
    junior_user: {
      telegram_id: ctx.message.from.id,
      active: true,
    },
  };
  createOrUpdateUser(data);
  ctx.reply(`Профиль был открыт ${baseUrl}`);
  updateMainPage();
});
bot.on("photo", (ctx) => {
  console.log(ctx.message);
  const file_id = ctx.message.photo[ctx.message.photo.length - 1].file_id;
  updateUserAvatar({
    file_id,
    junior_user: {
      telegram_id: ctx.message.from.id,
      active: true,
    },
  });
  if (session.step === "photo") {
    session.step = null;
    ctx.reply(`Профиль активирован! 💖 ${baseUrl}\n/help`);
  } else {
    ctx.reply(`Фото профиля обновлено! 💈 ${baseUrl}\n/help`);
  }
  updateMainPage();
});
bot.on("text", async (ctx) => {
  console.log(ctx.message);
  if (ctx.message.text === "/stop") {
    session.step = null;
    return ctx.reply("Работа с профилем приостановлена. Спасибо!");
  }
  if (session.step === "username") {
    if (ctx.message.text.length > 6) {
      // update username
      session.username = ctx.message.text;
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
      session.stack = ctx.message.text;
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
      // update server data
      const data = {
        junior_user: {
          telegram_id: ctx.message.from.id,
          username: session.username,
          stack: session.stack,
          experience: ctx.message.text,
        },
      };
      createOrUpdateUser(data);
      session.step = "photo";
      const profile = await getProfile({ telegram_id: ctx.message.from.id });
      if (profile.image) {
        return ctx.reply(`Фото профиля было обновлено\n ${baseUrl}`);
      } else {
        return ctx.reply(
          "Спасибо за регистрацию!\nЧтобы активировать профиль отравьте ваше фото в чат.\n/help"
        );
      }
    } else {
      return ctx.reply("Попробуй отправить сообщение об опыте/курсах снова");
    }
  }
  if (!session.step) {
    return ctx.reply(helpText);
  }
});
bot.launch();
