const admin = require("firebase-admin");
const { getEthGasPrice } = require("../integrations/ethClient");
const { getEthPrice } = require("../integrations/exchangeAPI");
const { sendSlackMessage } = require("../integrations/slack");

const ALERTS_COLLECTION_ID = "alerts";
export const DEFAULT_ALERT_INTERVAL_HRS = 5;

const getCollectionRef = (collectionId) =>
  admin.firestore().collection(collectionId);

const sendAlerts = async () => {
  const { ethUsdPrice } = await getEthPrice();
  const { gweiGasPrice } = await getEthGasPrice();
  const alertsCollectionRef = getCollectionRef(ALERTS_COLLECTION_ID);
  const querySnapshot = await alertsCollectionRef.get();
  let updatedAlerts = [];
  querySnapshot.forEach((documentSnapshot) => {
    const {
      priceThreshold: minEthUsdPrice,
      gasThreshold: minGweiGasPrice,
      userId,
      lastAlertTime,
      alertInterval: userAlertInterval,
    } = documentSnapshot.data();
    let readyForUpdate = true;
    let alertInterval = userAlertInterval
      ? userAlertInterval
      : DEFAULT_ALERT_INTERVAL_HRS;
    if (lastAlertTime) {
      const nextUpdateTime = lastAlertTime.toDate();
      nextUpdateTime.setHours(nextUpdateTime.getHours() + alertInterval);
      if (nextUpdateTime > admin.firestore.Timestamp.now().toDate()) {
        readyForUpdate = false;
      }
    }
    let alertText = "";
    let updated = false;
    if (readyForUpdate) {
      if (ethUsdPrice < minEthUsdPrice) {
        alertText =
          alertText +
          `ETH is at $${ethUsdPrice} USD!\nBelow your threshold of ${minEthUsdPrice}\n`;
        updated = true;
      }
      if (gweiGasPrice < minGweiGasPrice) {
        alertText =
          alertText +
          `Gas is at ${gweiGasPrice} gwei!\nBelow your threshold of ${minGweiGasPrice}\n`;
        updated = true;
      }
    }
    if (updated) {
      updatedAlerts.push(userId);
      sendSlackMessage(userId, alertText);
    }
  });
  return Promise.all(
    updatedAlerts.map((userId) => {
      alertsCollectionRef
        .doc(userId)
        .set(
          { lastAlertTime: admin.firestore.Timestamp.now() },
          { merge: true }
        );
    })
  );
};

const setEthGasAlert = async (userId, username, gasThreshold) => {
  const alertsCollectionRef = getCollectionRef(ALERTS_COLLECTION_ID);
  const userAlertsDocRef = alertsCollectionRef.doc(userId);
  return userAlertsDocRef.set(
    { userId, username, gasThreshold, lastAlertTime: undefined },
    { merge: true }
  );
};

const setEthPriceAlert = async (userId, username, priceThreshold) => {
  const alertsCollectionRef = getCollectionRef(ALERTS_COLLECTION_ID);
  const userAlertsDocRef = alertsCollectionRef.doc(userId);
  return userAlertsDocRef.set(
    { userId, username, priceThreshold, lastAlertTime: undefined },
    { merge: true }
  );
};

const isFirstTimeUser = async (userId) => {
  const alertsCollectionRef = getCollectionRef(ALERTS_COLLECTION_ID);
  const userAlertsDocRef = alertsCollectionRef.doc(userId);
  const userAlertsSnapshot = await userAlertsDocRef.get();
  return userAlertsSnapshot.exists;
};

const getUserAlerts = async (userId) => {
  const alertsCollectionRef = getCollectionRef(ALERTS_COLLECTION_ID);
  const userAlertsDocRef = alertsCollectionRef.doc(userId);
  const userAlertsSnapshot = await userAlertsDocRef.get();
  return userAlertsSnapshot.data();
};

module.exports = {
  sendAlerts,
  setEthGasAlert,
  setEthPriceAlert,
  isFirstTimeUser,
  getUserAlerts,
};
