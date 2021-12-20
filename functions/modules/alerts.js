const admin = require("firebase-admin");
const { getEthGasPrice } = require("../web3/ethClient");
const { getEthPrice } = require("../web2/exchangeAPI");

const sendAlerts = async () => {
  let alertText = "";
  const { ethUsdPrice } = await getEthPrice();
  const { gweiGasPrice } = await getEthGasPrice();
  const alertsCollectionRef = admin.firestore().collection("alerts");
  const querySnapshot = await alertsCollectionRef.get();
  querySnapshot.forEach((documentSnapshot) => {
    let alertText = "";
    const {
      priceThreshold: minEthUsdPrice,
      gasThreshold: minGweiGasPrice,
      lastAlertTime,
    } = documentSnapshot.data();
    const nextUpdateTime = lastAlertTime.toDate();
    nextUpdateTime.setHours(nextUpdateTime.getHours() - 10);
    if (nextUpdateTime < admin.firestore.Timestamp.now().toDate()) {
      if (minEthUsdPrice && ethUsdPrice < minEthUsdPrice) {
        alertText =
          alertText +
          `ETH Price has dropped below your threshold of ${minEthUsdPrice}\nIt is now at $${ethUsdPrice} USD\n`;
      }
      if (minGweiGasPrice && minGweiGasPrice < minGweiGasPrice) {
        alertText =
          alertText +
          `Gas Price has dropped below your threshold of ${minGweiGasPrice}\nIt is now at ${gweiGasPrice} gwei\n`;
      }
      return alertText;
    }
  });
  return alertText;
};

const setEthGasAlert = async (userId, username, gasThreshold) => {
  const alertsCollectionRef = admin.firestore().collection("alerts");
  const userAlertsDocRef = alertsCollectionRef.doc(userId);
  userAlertsDocRef.set({ userId, username, gasThreshold }, { merge: true });
};

const setEthPriceAlert = async (userId, username, priceThreshold) => {
  const alertsCollectionRef = admin.firestore().collection("alerts");
  const userAlertsDocRef = alertsCollectionRef.doc(userId);
  userAlertsDocRef.set({ userId, username, priceThreshold }, { merge: true });
};

module.exports = {
  sendAlerts,
  setEthGasAlert,
  setEthPriceAlert,
};
