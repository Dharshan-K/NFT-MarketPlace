/** @format */

// /** @format */

// const { ethers } = require("hardhat");
// const fs = require("fs");
// require("dotenv").config();

// const update_contract_address =
//   "../voting_dapp_nextjs/constants/contractAddress.json";

// const update_abi = "../voting_dapp_nextjs/constants/abi.json";

// module.exports = async function () {
//   if (process.env.UPDATE_FRONT_END) {
//     console.log("updating front end");
//     updateContractAddress();
//     updateAbi();
//     console.log("abi updated");
//   }
//   console.log(process.env.UPDATE_FRONT_END);
// };

// async function updateAbi() {
//   console.log("updating abi.......");
//   const voting = await ethers.getContract("voting");

//   fs.writeFileSync(
//     update_abi,
//     voting.interface.format(ethers.utils.FormatTypes.json)
//   );
// }

// async function updateContractAddress() {
//   console.log("updating address.........");
//   const voting = await ethers.getContract("voting");
//   console.log(voting);
//   const contractAddress = JSON.parse(
//     fs.readFileSync(update_contract_address, "utf8")
//   );
//   if (network.config.chainId.toString() in contractAddress) {
//     if (
//       !contractAddress[network.config.chainId.toString()].includes(
//         voting.address
//       )
//     ) {
//       contractAddress[network.config.chainId.toString()].push(voting.address);
//     }
//   }
//   {
//     contractAddress[network.config.chainId.toString()] = voting.address;
//   }
//   fs.writeFileSync(update_abi, JSON.stringify(contractAddress));
// }

// module.exports.tags = ["all", "frontend"];
