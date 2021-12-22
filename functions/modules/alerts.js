const { getEthGasPrice } = require("../integrations/ethClient");
const { getEthPrice } = require("../integrations/exchangeAPI");
const { sendSlackMessage } = require("../integrations/slack");
const {
  mapOverAlerts,
  setAlertDoc,
  getAlertDoc,
  doesAlertExist,
} = require("../integrations/firebase/collections/alerts");
const {
  serverTimestampNow,
  deleteFieldValue,
} = require("../integrations/firebase/utils");

const DEFAULT_ALERT_INTERVAL_HRS = 5;

const sendAlerts = async () => {
  const { ethUsdPrice } = await getEthPrice();
  const { gweiGasPrice } = await getEthGasPrice();
  const alertsToSend = await mapOverAlerts((alert) => {
    const {
      priceThreshold: minEthUsdPrice,
      gasThreshold: minGweiGasPrice,
      userId,
      lastAlertTime,
      alertInterval: userAlertInterval,
    } = alert;
    let readyForUpdate = true;
    let alertInterval = userAlertInterval
      ? userAlertInterval
      : DEFAULT_ALERT_INTERVAL_HRS;
    if (lastAlertTime) {
      const nextUpdateTime = lastAlertTime.toDate();
      nextUpdateTime.setHours(nextUpdateTime.getHours() + alertInterval);
      if (nextUpdateTime > serverTimestampNow().toDate()) {
        readyForUpdate = false;
      }
    }
    let alertText = "";
    if (readyForUpdate) {
      if (ethUsdPrice < minEthUsdPrice) {
        alertText =
          alertText +
          `ETH is at $${ethUsdPrice} USD!\nBelow your threshold of ${minEthUsdPrice}\n`;
      }
      if (gweiGasPrice < minGweiGasPrice) {
        alertText =
          alertText +
          `Gas is at ${gweiGasPrice} gwei!\nBelow your threshold of ${minGweiGasPrice}\n`;
      }
    }
    return { userId, alertText };
  });
  return Promise.all(
    alertsToSend.map(async ({ userId, alertText }) => {
      if (alertText) {
        await sendSlackMessage(userId, alertText);
        await setAlertDoc(userId, { lastAlertTime: serverTimestampNow() });
      }
    })
  );
};

const setEthGasAlert = async (userId, username, gasThreshold) => {
  return setAlertDoc(userId, {
    userId,
    username,
    gasThreshold,
    lastAlertTime: deleteFieldValue(),
  });
};

const setEthPriceAlert = async (userId, username, priceThreshold) => {
  return setAlertDoc(userId, {
    userId,
    username,
    priceThreshold,
    lastAlertTime: deleteFieldValue(),
  });
};

const isFirstTimeUser = async (userId) => {
  return doesAlertExist(userId);
};

const getUserThresholds = async (userId) => {
  const { gasThreshold, priceThreshold } = await getAlertDoc(userId);
  return { gasThreshold, priceThreshold };
};

module.exports = {
  sendAlerts,
  setEthGasAlert,
  setEthPriceAlert,
  isFirstTimeUser,
  getUserThresholds,
  DEFAULT_ALERT_INTERVAL_HRS,
};
