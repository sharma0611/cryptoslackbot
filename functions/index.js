const functions = require("firebase-functions");
const { getEthGasPrice } = require("./web3/client");
const { getEthPrice } = require("./web2/exchangeAPI");

const prettyPrint = (label, value, suffix = "", prefix = "") => {
  return ` - ${label}: ${prefix} ${value
    .toString()
    .substring(0, 8)} ${suffix}\n`;
};

const averageTransactionCostUsd = (ethUsdPrice, gweiGasPrice) => {
  const averageGasUnits = 120000;
  return (averageGasUnits * ethUsdPrice * gweiGasPrice) / 10 ** 9;
};

exports.ethNow = functions.https.onRequest(async (request, response) => {
  try {
    const { ethUsdPrice } = await getEthPrice();
    const { gweiGasPrice } = await getEthGasPrice();
    const avgUsdGasPrice = averageTransactionCostUsd(ethUsdPrice, gweiGasPrice);
    const ethUsdStr = prettyPrint("ETH", ethUsdPrice, "USD", "$");
    const gweiGasStr = prettyPrint("Gas", gweiGasPrice, "gwei");
    const avgGasStr = prettyPrint("Avg Txn", avgUsdGasPrice, "USD", "$");
    const text = ethUsdStr + gweiGasStr + avgGasStr;
    response.send({ text });
  } catch (e) {
    response.send({ error: e.toString() });
  }
});
