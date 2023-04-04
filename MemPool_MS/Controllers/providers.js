const { ethers } = require("ethers");

/**
 * Create Providers
 */
const MUMBAI_80001 = new ethers.providers.JsonRpcProvider(
  // process.env.MUMBAI_80001,
  "https://rpc.ankr.com/polygon_mumbai",
  80001
);

const GOERLIETH = new ethers.providers.JsonRpcProvider(
  "https://rpc.ankr.com/eth_goerli",
  5
);

const QuickNode = new ethers.providers.WebSocketProvider(
  "wss://purple-lively-moon.matic-testnet.discover.quiknode.pro/0d97882d0b726da5b7a929a3e8c5efe837f1dd78/"
);


/**
 * Export
 */
module.exports = {
  MUMBAI_80001,
  GOERLIETH,
  QuickNode
};