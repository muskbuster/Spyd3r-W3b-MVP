require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");
require('solidity-coverage');
require("@nomiclabs/hardhat-web3");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  gasReporter: {
    enabled: true,
  },
  networks: {
    hardhat: {
      gasPrice: 470000000000,
      chainId: 43112,
    },
    // matic: {
    //   url: "https://rpc-mumbai.maticvigil.com",
    //   accounts: [process.env.PRIVATE_KEY],
    // },
    // goerli: {
    //   url: "https://rpc.ankr.com/eth_goerli",
    //   accounts: [process.env.PRIVATE_KEY],
    // },


  },
};