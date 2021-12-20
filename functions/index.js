const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const { getEthTextUpdate } = require("./modules/updates");
const {
  setEthGasAlert,
  setEthPriceAlert,
  sendAlerts,
} = require("./modules/alerts");

exports.ethNow = functions.https.onRequest(async (request, response) => {
  try {
    const ethTextUpdate = await getEthTextUpdate();
    response.send({ text: ethTextUpdate });
  } catch (e) {
    response.send({ error: e.toString() });
  }
});

exports.sendAlerts = functions.https.onRequest(async (request, response) => {
  try {
    await sendAlerts();
    response.status(200);
  } catch (e) {
    response.send({ error: e.toString() });
  }
});

exports.setEthGasAlert = functions.https.onRequest(
  async (request, response) => {
    try {
      const {
        user_id: userId,
        user_name: username,
        text: userEnteredText,
      } = request.body;
      const gasThreshold = parseInt(userEnteredText);
      setEthGasAlert(userId, username, gasThreshold);
      // response.send({ text: JSON.stringify(request.body) });
      response.sendStatus(200);
    } catch (e) {
      response.send({ error: e.toString() });
    }
  }
);

exports.setEthPriceAlert = functions.https.onRequest(
  async (request, response) => {
    try {
      const {
        user_id: userId,
        user_name: username,
        text: userEnteredText,
      } = request.body;
      const priceThreshold = parseInt(userEnteredText);
      setEthPriceAlert(userId, username, priceThreshold);
      // response.send({ text: JSON.stringify(request.body) });
      response.sendStatus(200);
    } catch (e) {
      response.send({ error: e.toString() });
    }
  }
);
