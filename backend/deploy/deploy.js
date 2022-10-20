/** @format */

const { network, deployments, getNamedAccounts, ethers } = require("hardhat");

const NFT_ABI_FILE = "../constants/NFTAbi.json";
const NFT_CONTRACT_ADDRESS_FILE = "../constants/NFTContractAddress.json";

const NFTMarket_ABI_FILE = "../constants/NFTMarketAbi.json";
const NFTMarket_CONTRACT_ADDRESS_FILE =
  "../constants/NFTMarketContractAddress.json";

const fs = require("fs");
require("dotenv").config();

module.exports = async function () {
  const { deployer } = await getNamedAccounts({
    getNamedAccounts,
    deployments,
  });
  console.log("deploying contract............");
  console.log(deployer);
  console.log(process.env.PRIVATE_KEY);

  const { deploy, log } = deployments;
  const nftMarketDeployed = await deploy("NFTMarket", { from: deployer });
  console.log("----------------------------------");
  const nftDeployed = await deploy("NFT", {
    from: deployer,
    args: [nftMarketDeployed.address],
  });

  console.log(nftMarketDeployed.address);
  console.log(nftDeployed.address);

  const nftContract = await ethers.getContract("NFT");
  fs.writeFileSync(
    NFT_ABI_FILE,
    nftContract.interface.format(ethers.utils.FormatTypes.json)
  );

  const chainId = network.config.chainId.toString();
  console.log(chainId);

  fs.writeFileSync(NFT_CONTRACT_ADDRESS_FILE, "{}");

  const NFTContractAddress = JSON.parse(
    fs.readFileSync(NFT_CONTRACT_ADDRESS_FILE, "utf8")
  );
  console.log("updating ADDRESS-------------");
  if (chainId in NFTContractAddress) {
    if (!NFTContractAddress[chainId].includes(nftContract.address)) {
      NFTContractAddress[chainId].push(nftContract.address);
    }
  }
  {
    NFTContractAddress[chainId] = [nftContract.address];
  }
  fs.writeFileSync(
    NFT_CONTRACT_ADDRESS_FILE,
    JSON.stringify(NFTContractAddress)
  );

  //   ---------------------------NFTMARKET------------------------

  const nftMarketContract = await ethers.getContract("NFTMarket");
  console.log("NFTMARKET: ", nftMarketContract.address);
  console.log("NFT: ", nftContract.address);
  fs.writeFileSync(
    NFTMarket_ABI_FILE,
    nftMarketContract.interface.format(ethers.utils.FormatTypes.json)
  );
  fs.writeFileSync(NFTMarket_CONTRACT_ADDRESS_FILE, "{}");

  const NFTMarketContractAddress = JSON.parse(
    fs.readFileSync(NFTMarket_CONTRACT_ADDRESS_FILE, "utf8")
  );
  console.log("updating ADDRESS-------------");
  if (chainId in NFTMarketContractAddress) {
    if (
      !NFTMarketContractAddress[chainId].includes(nftMarketContract.address)
    ) {
      NFTMarketContractAddress[chainId].push(nftMarketContract.address);
    }
  }
  {
    NFTMarketContractAddress[chainId] = [nftMarketContract.address];
  }
  fs.writeFileSync(
    NFTMarket_CONTRACT_ADDRESS_FILE,
    JSON.stringify(NFTMarketContractAddress)
  );
};

module.exports.tags = ["all", "NFT"];
