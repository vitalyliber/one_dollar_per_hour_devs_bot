const axios = require("axios");

const getProfile = (data) => {
  return axios({
    url: `https://gym-server.casply.com/junior_users/user`,
    headers: {
      "Content-type": "application/json",
    },
    data,
    method: "GET",
  })
    .then(({ data }) => {
      console.log(data);
      return data;
    })
    .catch((e) => console.log(e.response, e));
};

module.exports = getProfile;
