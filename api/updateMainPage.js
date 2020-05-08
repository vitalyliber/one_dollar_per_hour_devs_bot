const axios = require("axios");

const updateMainPage = () => {
  return axios({
    url: `https://juniors.casply.com`,
    headers: {
      "Content-type": "application/json",
    },
    method: "GET",
  }).catch((e) => console.log(e.response, e));
};

module.exports = updateMainPage;
