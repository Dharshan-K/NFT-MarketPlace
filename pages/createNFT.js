/** @format */

import axios from "axios";
import { useState } from "react";
import { Web3Storage } from "web3.storage";
import Web3Modal from "web3modal";
import {
  NFTContractAddress,
  NFTAbi,
  NFTMarketContractAddress,
  NFTMarketAbi,
} from "../constants/index";

export default function UploadToIPFS() {
  const { fileUrl, setFileUrl } = useState();
  function getAccessToken() {
    return process.env.NEXT_PUBLIC_WEB3_API_KEY;
  }

  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
  }
  async function printInput() {
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const fileInput = document.querySelector('input[type="file"]');
    const client = makeStorageClient();
    const Imagecid = await client.put(fileInput.files);
    const NFTData = {};
    NFTData.name = name;
    NFTData.description = description;
    NFTData.price = price;
    NFTData.imageURL = `https://w3s.link/ipfs/${Imagecid}/${fileInput.files[0].name}`;
    console.log(NFTData);
    const blob = new Blob([JSON.stringify(NFTData)], {
      type: "application/json",
    });
    console.log("-----------------");
    // for await (const upload of client.list()) {
    //   console.log(
    //     `${upload.name} - cid: ${upload.cid} - size: ${upload.dagSize}`
    //   );
    //   const url = "https://w3s.link/ipfs/" + upload.cid + "/" + "pixel.json";
    //   const meta = await axios.get(url);
    //   console.log(meta.data);
    // }
    // console.log("finished");

    const file = [new File([blob], name + ".json")];
    const cid = await client.put(file);
    console.log("stored files with cid:", cid);
    const url = "https://w3s.link/ipfs/" + cid + "/" + name + ".json";
    createSale(url);
    console.log("NFT created");
  }

  async function createSale(url) {
    const web3modal = new Web3Modal();
    const ethers = require("ethers");
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    console.log(signer);
    const { ethereum } = window;
    console.log("started----");
    let chainId = parseInt(await ethereum.request({ method: "eth_chainId" }));
    const NFTAddress =
      chainId in NFTContractAddress ? NFTContractAddress[chainId][0] : null;
    const marketAddress =
      chainId in NFTMarketContractAddress
        ? NFTMarketContractAddress[chainId][0]
        : null;
    console.log(NFTAddress, marketAddress, chainId);
    let contract = new ethers.Contract(NFTAddress, NFTAbi, signer);
    let transaction = await contract.createTokens(url);
    let tx = await transaction.wait();

    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();
    const inputPrice = document.getElementById("price").value;
    const price = ethers.utils.parseUnits(inputPrice, "ether");

    contract = new ethers.Contract(marketAddress, NFTMarketAbi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(NFTAddress, tokenId, price, {
      value: listingPrice,
    });
    await transaction.wait();
    console.log("nft created");
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          id="name"
          placeholder="Asset"
          className="mt-8 border rounded p-4"
        />
        <textarea
          id="description"
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
        />
        <input
          id="price"
          placeholder="Asset price"
          className="mt-2 border rounded p-4"
        />
        <input type="file" name="asset" className="my-4" />
        {/* {fileUrl && <img className="rounded my-4" width="350" src="#" />} */}
        <button
          onClick={printInput}
          className="font-bold mt-4 bg-blue-500 ext-white rounded p-4 shadow-lg"
        >
          Create asset
        </button>
      </div>
    </div>
  );
}
