/** @format */

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", function () {
  it("creating and excecuting market sales", async function () {
    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    const nftMarket = await NFTMarket.deploy();
    await nftMarket.deployed();
    const nftMarketAddress = nftMarket.address;

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(nftMarketAddress);
    await nft.deployed();
    const nftAddress = nft.address;

    let listingPrice = await nftMarket.getListingPrice();

    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("100", "ether");

    await nft.createTokens("https://www.mytokenlocation.com");
    await nft.createTokens("https://www.mytokenlocation2.com");

    await nftMarket.createMarketItem(nftAddress, 1, auctionPrice, {
      value: listingPrice,
    });
    await nftMarket.createMarketItem(nftAddress, 2, auctionPrice, {
      value: listingPrice,
    });

    const [_, buyerAddress] = await ethers.getSigners();

    await nftMarket
      .connect(buyerAddress)
      .marketSale(nftMarketAddress, 1, { value: auctionPrice });

    const items = await market.fetchMarketItems();

    console.log(items);
  });
});
