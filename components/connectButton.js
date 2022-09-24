/** @format */

import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { contractAddress, abi } from "../constants";

export default function ConnectWallet() {
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      // console.log(ethereum);
      if (!ethereum) {
        console.log("metamask not detected");
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("connected to chain:" + parseInt(chainId));

      const goerliId = "0x5";
      if (chainId !== goerliId) {
        alert("not connected to goerli network");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("found accounts", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("error connecting to metamask");
    }
  };
  const checkCorrectNetwork = async () => {
    const { ethereum } = window;
    let chainId = await ethereum.request({ method: "eth_chainId" });
    // console.log("Connected to chain:" + chainId);

    const rinkebyChainId = "0x5";

    if (chainId !== rinkebyChainId) {
      setCorrectNetwork(false);
    } else {
      setCorrectNetwork(true);
    }
  };

  const proposalCount = async () => {
    try {
      const { ethereum } = window;

      let chainId = parseInt(await ethereum.request({ method: "eth_chainId" }));

      const votingAddress =
        chainId in contractAddress ? contractAddress[chainId][0] : null;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const votingContract = new ethers.Contract(votingAddress, abi, signer);
        const count = await votingContract.getProposalCount();
        // console.log(count + "---------------");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    connectWallet();
    checkCorrectNetwork();
  });

  return (
    // BEM
    <div>
      <div>
        {currentAccount === "" ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : correctNetwork ? (
          <div className="app">
            <h1>Connected</h1>
          </div>
        ) : (
          <div>
            <div>----------------------------------------</div>
            <div>Please connect to the Rinkeby Testnet</div>
            <div>and reload the page</div>
            <div>----------------------------------------</div>
          </div>
        )}
      </div>
    </div>
  );
}

// /** @format */
// import { ethers } from "ethers";
// import { useState, useEffect } from "react";
// import {
//   NFTContractAddress,
//   NFTAbi,
//   NFTMarketContractAddress,
//   NFTMarketAbi,
// } from "../constants";

// export default function ConnectWallet() {
//   const [currentAccount, setCurrentAccount] = useState("");
//   const connectWallet = async () => {
//     try {
//       const { ethereum } = window;
//       if (!ethereum) {
//         console.log("metamask not detected");
//       }
//       let chainId = await ethereum.request({ methos: "eth_chainId" });
//       console.log("connected to chain " + parseInt(chainId));

//       const hardhatId = "31337";
//       if (chainId != hardhatId) {
//         alert("not connected to hardhat");
//         return;
//       }

//       const accounts = await ethereum.request({
//         method: "eth_requestAccounts",
//       });
//       setCurrentAccount = accounts[0];
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     connectWallet();
//   });

//   return (
//     <div>
//       <div>
//         {currentAccount === "" ? (
//           <button onClick={connectWallet}>ConnectWallet</button>
//         ) : (
//           <div>Connect to hardhat</div>
//         )}
//       </div>
//     </div>
//   );
// }
