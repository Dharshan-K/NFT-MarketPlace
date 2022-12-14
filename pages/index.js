/** @format */

import Head from "next/head";
import Image from "next/image";
import axios from "axios";
import Web3Modal from "web3modal";
import { useEffect, useState } from "react";
import {
  NFTContractAddress,
  NFTAbi,
  NFTMarketContractAddress,
  NFTMarketAbi,
} from "../constants/index";
import { ethers } from "ethers";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://eth-goerli.g.alchemy.com/v2/9blXxQvhid7O-Zg9xXMOWqnGo6kCn2dL"
    );
    const nftContract = new ethers.Contract(
      NFTContractAddress["5"][0],
      NFTAbi,
      provider
    );
    const nftMarketContract = new ethers.Contract(
      NFTMarketContractAddress["5"][0],
      NFTMarketAbi,
      provider
    );

    const data = await nftMarketContract.fetchMarketItems();
    console.log("NFT details");
    console.log(data);

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await nftContract.tokenURI(i.tokenId);
        console.log("tokenUri: ", tokenUri);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.imageURL,
          name: meta.data.name,
          description: meta.data.description,
        };
        // console.log("the data", meta.data);
        console.log("--------------------------");
        console.log("data", meta.data);
        console.log("parsed", Object.values(meta.data));
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  async function buyNft(nft) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      NFTMarketContractAddress,
      NFTMarketAbi,
      signer
    );
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.marketSale(
      NFTContractAddress,
      nft.tokenId,
      { value: price }
    );
  }

  // console.log(nfts);

  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="px-20 py-20 text-3xl">No items</h1>;

  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: "1600px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} />
              <div className="p-4">
                <p
                  style={{ height: "64px" }}
                  className="text-2xl font-semibold"
                >
                  {nft.name}
                </p>
                <div style={{ height: "70px", overflow: "hidden" }}>
                  <p className="text-gray-400">{nft.description}</p>
                </div>
              </div>
              <div className="p-4 bg-black">
                <p className="text-2xl mb-4 font-bold text-white">
                  {nft.price} ETH
                </p>
                <button
                  className="w-full bg-blue-500 text-white font-bold py-2 px-12 rounded"
                  onClick={() => buyNft(nft)}
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
