/** @format */

require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const POLYGON_TESTNET_PRIVATE_KEY = process.env.POLYGON_TESTNET_PRIVATE_KEY;
const POLYGON_TESTNET_RPC_URL = process.env.POLYGON_TESTNET_URL;

const POLYGON_MAINNET_PRIVATE_KEY = process.env.POLYGON_MAINNET_PRIVATE_KEY;
const POLYGON_MAINNET_URL = process.env.POLYGON_MAINNET_URL;

const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
      chainId: 31337,
    },
    mumbai: {
      url: POLYGON_TESTNET_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
    mainnet: {
      url: POLYGON_MAINNET_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  solidity: "0.8.9",
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
  },
};
