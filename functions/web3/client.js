const Units = require("ethereumjs-units");
const Eth = require("ethjs");

const eth = new Eth(
  new Eth.HttpProvider(
    "https://mainnet.infura.io/v3/3514575db5b94ac891e163fc98436635"
  )
);

const getEthGasPrice = async () => {
  return eth.gasPrice().then((bn) => {
    const weiGasPrice = bn.clone().toNumber();
    const ethGasPrice = Units.convert(weiGasPrice, "wei", "eth");
    const gweiGasPrice = Units.convert(weiGasPrice, "wei", "gwei");
    return { ethGasPrice, weiGasPrice, gweiGasPrice };
  });
};

module.exports = {
  getEthGasPrice,
};
