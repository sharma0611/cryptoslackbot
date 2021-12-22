const { App } = require("@slack/bolt");

console.log("secret ", process.env.SLACK_SIGNING_SECRET);
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const sendSlackMessage = (userId, message) => {
  return app.client.chat.postMessage({ channel: userId, text: message });
};

module.exports = {
  sendSlackMessage,
};
