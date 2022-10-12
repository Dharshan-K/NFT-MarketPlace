/** @format */

const { useRouter } = require("next/router");
const { useState } = require("react");
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { uploadFileToIPFS, UploadtoIPFS } from "../scripts/pinata";
import {
  NFTContractAddress,
  NFTAbi,
  NFTMarketContractAddress,
  NFTMarketAbi,
} from "../constants/index";

const pinataAPIKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const pinataSecretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateformInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();
  const ethers = require("ethers");

  async function onChange(e) {
    const file = e.target.files[0];
    console.log(file);

    try {
      const response = await uploadFileToIPFS(file);
      if (response.success === true) {
        console.log("uploaded image to pinata: ", response.pinataURL);
        setFileUrl(response.pinataURL);
        console.log(response.pinataURL);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function createItem() {
    // const { name, description, price } = formInput;
    // if (!name || !description || !price || !fileUrl) return;
    // const data = JSON.stringify({
    //   name,
    //   description,
    //   image: fileUrl,
    // });
    // console.log(data);
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const NFTData = {};
    if (!name || !description || !price || !fileUrl) return;
    NFTData.name = name;
    NFTData.description = description;
    NFTData.price = price;
    NFTData.image = fileUrl;
    console.log(NFTData);

    try {
      const response = await UploadtoIPFS(NFTData);
      if (response.success === true) {
        console.log("uploaded JSON to pinata: ", response);
        setFileUrl(response.pinataURL);
      }

      createSale(fileUrl);
    } catch (error) {
      console.log(`error uploading file: `, error);
    }
  }

  function printInput() {
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const NFTData = {};
    NFTData.name = name;
    NFTData.description = description;
    NFTData.price = price;

    console.log(name, description, price);
    console.log(NFTData);
  }

  async function createSale(url) {
    const web3modal = new Web3Modal();
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

    const price = ethers.utils.parseUnits(formInput.price, "ether");

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
          onChange={(e) =>
            updateformInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          id="description"
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateformInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          id="price"
          placeholder="Asset price"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateformInput({ ...formInput, price: e.target.value })
          }
        />
        <input type="file" name="asset" className="my-4" onChange={onChange} />
        {fileUrl && <img className="rounded my-4" width="350" src={fileUrl} />}
        <button
          onClick={createItem}
          className="font-bold mt-4 bg-blue-500 ext-white rounded p-4 shadow-lg"
        >
          Create asset
        </button>
      </div>
    </div>
  );
}
