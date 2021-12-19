const axios = require("axios");

const getEthPrice = async () => {
  const response = await axios.get(
    "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR"
  );
  const { USD, BTC } = response.data;
  return { ethUsdPrice: USD, ethBtcPrice: BTC };
};

module.exports = {
  getEthPrice,
};
