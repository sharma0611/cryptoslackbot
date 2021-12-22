const { getEthGasPrice } = require("../integrations/ethClient");
const { getEthPrice } = require("../integrations/exchangeAPI");

const prettyPrint = (label, value, suffix = "", prefix = "") => {
  return ` - ${label}: ${prefix} ${value
    .toString()
    .substring(0, 8)} ${suffix}\n`;
};

const averageTransactionCostUsd = (ethUsdPrice, gweiGasPrice) => {
  const averageGasUnits = 120000;
  return (averageGasUnits * ethUsdPrice * gweiGasPrice) / 10 ** 9;
};

const getEthTextUpdate = async () => {
  const { ethUsdPrice } = await getEthPrice();
  const { gweiGasPrice } = await getEthGasPrice();
  const avgUsdGasPrice = averageTransactionCostUsd(ethUsdPrice, gweiGasPrice);
  const ethUsdStr = prettyPrint("ETH", ethUsdPrice, "USD", "$");
  const gweiGasStr = prettyPrint("Gas", gweiGasPrice, "gwei");
  const avgGasStr = prettyPrint("Avg Txn", avgUsdGasPrice, "USD", "$");
  const text = ethUsdStr + gweiGasStr + avgGasStr;
  return text;
};

module.exports = {
  getEthTextUpdate,
};
