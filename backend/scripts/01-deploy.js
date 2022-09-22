/** @format */

const { network, deployments, getNamedAccounts, ethers } = require("hardhat");

module.exports = async function () {
  const { deployer } = await getNamedAccounts({
    getNamedAccounts,
    deployments,
  });
  const { deploy, log } = deployments;
  const votingDeployed = await deploy("votingDAO", {
    from: deployer,
  });
  console.log("the address deployed is");
  console.log(network.name);
  console.log(votingDeployed.address);
};

module.exports.tags = ["all", "voting"];
