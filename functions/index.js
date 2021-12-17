const functions = require("firebase-functions");
const Units = require("ethereumjs-units");
const Eth = require("ethjs");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const eth = new Eth(
  new Eth.HttpProvider(
    "https://mainnet.infura.io/v3/3514575db5b94ac891e163fc98436635"
  )
);

const getEthGasPrice = () => {
  return eth.gasPrice().then((bn) => {
    const weiGasPrice = bn.clone().toNumber();
    const ethGasPrice = Units.convert(weiGasPrice, "wei", "eth");
    const gweiGasPrice = Units.convert(weiGasPrice, "wei", "gwei");
    return { ethGasPrice, weiGasPrice, gweiGasPrice };
  });
};

exports.ethNow = functions.https.onRequest((request, response) => {
  getEthGasPrice()
    .then(({ ethGasPrice, weiGasPrice, gweiGasPrice }) => {
      const text = `- gas price in eth:  ${ethGasPrice}\n- gas price in gwei: ${gweiGasPrice}\n- gas price in wei:  ${weiGasPrice}`;
      response.send({ text });
    })
    .catch((error) => {
      response.send({ error: error.toString() });
    });
});
