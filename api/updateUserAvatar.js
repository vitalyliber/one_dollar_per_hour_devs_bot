const axios = require("axios");
const createOrUpdateUser = require("./createOrUpdateUser");

const updateUserAvatar = async (params) => {
  try {
    const {
      data: {
        result: { file_path },
      },
    } = await axios({
      url: `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile`,
      headers: {
        "Content-type": "application/json",
      },
      params,
      data: null,
      method: "GET",
    });
    const image_url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file_path}`;
    await createOrUpdateUser({ image_url, junior_user: params.junior_user });
  } catch (e) {
    console.log(e.response, e);
  }
};

module.exports = updateUserAvatar;
