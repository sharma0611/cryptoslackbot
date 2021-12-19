const functions = require("firebase-functions");
const { getEthGasPrice } = require("./web3/client");
const { getEthPrice } = require("./web2/exchangeAPI");

const prettyPrint = (label, value) => {
  return ` - ${label}: ${value}\n`;
};
exports.ethNow = functions.https.onRequest(async (request, response) => {
  try {
    const { ethUsdPrice } = await getEthPrice();
    const { ethGasPrice, weiGasPrice, gweiGasPrice } = await getEthGasPrice();
    const ethGasString = prettyPrint("gas price in eth", ethGasPrice);
    const weiGasString = prettyPrint("gas price in wei", weiGasPrice);
    const gweiGasString = prettyPrint("gas price in gwei", gweiGasPrice);
    const ethUsdPriceString = prettyPrint("eth price in USD", ethUsdPrice);
    const text =
      ethGasString + weiGasString + gweiGasString + ethUsdPriceString;
    response.send({ text });
  } catch (e) {
    response.send({ error: e.toString() });
  }
});
