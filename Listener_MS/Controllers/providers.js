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


/**
 * Export
 */
module.exports = {
  MUMBAI_80001,
  GOERLIETH

};