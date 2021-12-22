const { getCollectionRef } = require("../utils");

const ALERTS_COLLECTION_ID = "alerts";

const mapOverAlerts = async (mapFn) => {
  const alertsCollectionRef = getCollectionRef(ALERTS_COLLECTION_ID);
  const querySnapshot = await alertsCollectionRef.get();
  let mappedResult = [];
  querySnapshot.forEach((documentSnapshot) => {
    const mapResult = mapFn(documentSnapshot.data());
    mappedResult.push(mapResult);
  });
  return mappedResult;
};

const setAlertDoc = async (userId, partialDoc) => {
  const alertsCollectionRef = getCollectionRef(ALERTS_COLLECTION_ID);
  return alertsCollectionRef.doc(userId).set(partialDoc, { merge: true });
};

const getAlertDoc = async (userId) => {
  const alertsCollectionRef = getCollectionRef(ALERTS_COLLECTION_ID);
  const userAlertsDocRef = alertsCollectionRef.doc(userId);
  const userAlertsSnapshot = await userAlertsDocRef.get();
  return userAlertsSnapshot.data();
};

const doesAlertExist = async (userId) => {
  const alertsCollectionRef = getCollectionRef(ALERTS_COLLECTION_ID);
  const userAlertsDocRef = alertsCollectionRef.doc(userId);
  const userAlertsSnapshot = await userAlertsDocRef.get();
  return userAlertsSnapshot.exists;
};

module.exports = {
  mapOverAlerts,
  setAlertDoc,
  getAlertDoc,
  doesAlertExist,
};
