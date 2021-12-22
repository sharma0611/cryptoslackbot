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

const isReadyForAlert = (lastAlertTime, alertInterval) => {
  if (lastAlertTime) {
    const nextAlertTime = lastAlertTime.toDate();
    nextAlertTime.setHours(nextAlertTime.getHours() + alertInterval);
    if (nextAlertTime > serverTimestampNow().toDate()) {
      return false;
    }
  }
  return true;
};

const sendAlerts = async () => {
  const { ethUsdPrice } = await getEthPrice();
  const { gweiGasPrice } = await getEthGasPrice();
  const alertsToSend = await mapOverAlerts((alert) => {
    const {
      priceThreshold: minEthUsdPrice,
      gasThreshold: minGweiGasPrice,
      userId,
      lastAlertTimeGas,
      lastAlertTimePrice,
      alertInterval: userAlertInterval,
    } = alert;
    let alertInterval = userAlertInterval
      ? userAlertInterval
      : DEFAULT_ALERT_INTERVAL_HRS;
    let readyForGasAlert = isReadyForAlert(lastAlertTimeGas, alertInterval);
    let readyForPriceAlert = isReadyForAlert(lastAlertTimePrice, alertInterval);
    let alertText = "";
    if (readyForPriceAlert && ethUsdPrice < minEthUsdPrice) {
      alertText =
        alertText +
        `ETH is at $${ethUsdPrice} USD!\nBelow your threshold of ${minEthUsdPrice}\n`;
    }
    if (readyForGasAlert && gweiGasPrice < minGweiGasPrice) {
      alertText =
        alertText +
        `Gas is at ${gweiGasPrice} gwei!\nBelow your threshold of ${minGweiGasPrice}\n`;
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
