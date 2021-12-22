const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
require("dotenv").config();
const { getEthTextUpdate } = require("./modules/updates");
const {
  setEthGasAlert,
  setEthPriceAlert,
  sendAlerts,
  isFirstTimeUser,
  getUserThresholds,
  DEFAULT_ALERT_INTERVAL_HRS,
} = require("./modules/alerts");

// /ethnow
exports.ethNow = functions.https.onRequest(async (request, response) => {
  try {
    const ethTextUpdate = await getEthTextUpdate();
    response.send({ text: ethTextUpdate });
  } catch (e) {
    response.send({ error: e.toString() });
  }
});

// /sendalerts
exports.sendAlerts = functions.https.onRequest(async (request, response) => {
  try {
    await sendAlerts();
    response.send({ text: "All good!" });
    return;
  } catch (e) {
    response.send({ error: e.toString() });
  }
});

// /setgasalert
exports.setEthGasAlert = functions.https.onRequest(
  async (request, response) => {
    try {
      const {
        user_id: userId,
        user_name: username,
        text: userEnteredText,
      } = request.body;
      const gasThreshold = parseInt(userEnteredText);
      const firstTime = await isFirstTimeUser(userId);
      await setEthGasAlert(userId, username, gasThreshold);
      const responseText = firstTime
        ? `I'll check every 30 mins if gas is under ${gasThreshold} gwei and let you know.\n\nI won't bother you more than once every 5 hours. (pssst... you can change this with \`\\setAlertInterval\`. See all the commands at \`\\helpcrypto\`.)`
        : `I'll let you know when gas is under ${gasThreshold} gwei`;
      response.send({ text: responseText });
    } catch (e) {
      response.send({ error: e.toString() });
    }
  }
);

// /setpricealert
exports.setEthPriceAlert = functions.https.onRequest(
  async (request, response) => {
    try {
      const {
        user_id: userId,
        user_name: username,
        text: userEnteredText,
      } = request.body;
      const priceThreshold = parseInt(userEnteredText);
      const firstTime = await isFirstTimeUser(userId);
      await setEthPriceAlert(userId, username, priceThreshold);
      const responseText = firstTime
        ? `I'll check every 30 mins if ETH is under $${priceThreshold} USD and let you know.\n\nI won't bother you more than once every ${DEFAULT_ALERT_INTERVAL_HRS} hours.`
        : `I'll let you know when ETH is under $${priceThreshold} USD`;
      response.send({ text: responseText });
    } catch (e) {
      response.send({ error: e.toString() });
    }
  }
);

// /viewalerts
exports.viewAlerts = functions.https.onRequest(async (request, response) => {
  try {
    const { user_id: userId } = request.body;
    const thresholds = await getUserThresholds(userId);
    const { gasThreshold, priceThreshold } = thresholds;
    let responseText = "";
    if (gasThreshold) {
      responseText =
        responseText + `Your gas alert threshold is ${gasThreshold} gwei.\n`;
    }
    if (priceThreshold) {
      responseText =
        responseText +
        `Your price alert threshold is $${priceThreshold} USD.\n`;
    }
    if (!responseText) {
      responseText = "You have no alerts set.";
    }
    response.send({ text: responseText });
  } catch (e) {
    response.send({ error: e.toString() });
  }
});

// /helpcrypto
exports.helpcrypto = functions.https.onRequest(async (request, response) => {
  try {
    let responseText =
      "Use the following commands:\n`\\ethnow`\n`\\setgasalert`\n`\\setpricealert`\n`\\viewalerts`\n`\\clearalerts`\nUse in any channel. Only you receive the messages.";
    response.send({ text: responseText });
  } catch (e) {
    response.send({ error: e.toString() });
  }
});

exports.scheduledAlerts = functions.pubsub
  .schedule("0,30 0-23 * * *")
  .timeZone("America/New_York")
  .onRun(async () => {
    await sendAlerts();
    return null;
  });
