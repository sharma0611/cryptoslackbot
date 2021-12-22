const { App } = require("@slack/bolt");

const sendSlackMessage = (userId, message) => {
  const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
  });
  return app.client.chat.postMessage({ channel: userId, text: message });
};

module.exports = {
  sendSlackMessage,
};
