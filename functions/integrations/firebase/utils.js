const admin = require("firebase-admin");

const getCollectionRef = (collectionId) =>
  admin.firestore().collection(collectionId);

const serverTimestampNow = () => admin.firestore.Timestamp.now();

const deleteFieldValue = () => admin.firestore.FieldValue.delete();

module.exports = {
  getCollectionRef,
  serverTimestampNow,
  deleteFieldValue,
};
