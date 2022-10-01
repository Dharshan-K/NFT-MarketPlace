/** @format */

const { useRouter } = require("next/router");
const { useState } = require("react");
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { create as ipfsHttpCLient } from "ipfs-http-client";
import {
  NFTContractAddress,
  NFTAbi,
  NFTMarketContractAddress,
  NFTMarketAbi,
} from "../constants/index";

const client = ipfsHttpCLient("https://ipfs.infura.io:5001/api/v0");

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateformInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (e) {
      console.log(e);
    }
  }

  async function createItem() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });

    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      createSale(url);
    } catch (error) {
      console.log(`error uploading file: `, error);
    }
  }

  async function createSale(url) {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(NFTContractAddress, NFTAbi, signer);
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();

    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();

    const price = ethers.utils.parseUints(formInput.price, "ether");

    contract = new ethers.Contract(
      NFTMarketContractAddress,
      NFTMarketAbi,
      signer
    );
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(
      NFTContractAddress,
      tokenId,
      price,
      { value: listingPrice }
    );
    await transaction.wait();
    router.push("/");
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateformInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateformInput({ ...formInput, description: e.target.value })
          }
        />
        <input
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
