// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract Marketplace is ReentrancyGuard {

uint256 private _itemIds;
uint256 private _itemsSold;

address payable owner;

uint256 constant LISTING_PRICE = 0.025 ether;

constructor () {
    owner = payable(msg.sender);
}

struct MarketItem {
    uint256 tokenId;
    address nftContract;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
}


mapping (uint256 => MarketItem) private idToMarketItem;


event MarketItemCreated(
    uint256 indexed itemid,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold
);

event ItemSold(
    uint256 indexed itemid,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address buyer,
    uint256 price
);

function getListingPrice() public pure returns(uint256) {
    return LISTING_PRICE;
}

function createMarketItem(address nftContract, uint256 tokenId, uint256 price) public payable nonReentrant {
    require(price > 0, "Price must be at least 1 wei");
    require(msg.value == LISTING_PRICE, "Price must be equal to Lisitng Price");

    _itemIds++;

    idToMarketItem[_itemIds] = MarketItem(
        tokenId,
        nftContract,
        payable(msg.sender),
        payable(address(0)),
        price,
        false
    );

    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

    emit MarketItemCreated(_itemIds, nftContract, tokenId, msg.sender, address(0), price, false);
}

function buyMarketItem(uint256 itemId) public payable nonReentrant {
    uint256 price = idToMarketItem[itemId].price;
    uint256 tokenId = idToMarketItem[itemId].tokenId;
    address nftContract = idToMarketItem[itemId].nftContract;

    require(msg.value ==  price, "Provide appropriate price");

    address payable seller = idToMarketItem[itemId].seller;

    seller.transfer(msg.value);

    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

    idToMarketItem[itemId].owner = payable(msg.sender);
    idToMarketItem[itemId].sold = true;

    _itemsSold++;

    payable(owner).transfer(LISTING_PRICE);

    emit ItemSold(itemId, nftContract, tokenId, seller, msg.sender, price);
}

function fetchMarketItems() public view returns(MarketItem[] memory) {
    uint256 itemCount = _itemIds;
    uint256 unsoldItemCount = _itemIds - _itemsSold;
    uint256 currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);

    for (uint256 i=0; i < itemCount; i++) {
        if(idToMarketItem[i+1].owner == address(0)) {
            uint256 currentId = i+1;

            MarketItem storage currentItem = idToMarketItem[currentId];

            items[currentIndex] = currentItem;

            currentIndex++;
        }
    }
    return items;
}

function fetchMyNfts() public view returns (MarketItem[] memory) {
    uint256 totalItemCount = _itemIds;
    uint256 itemCount = 0;
    uint currentIndex = 0;

    for(uint256 i = 0; i < totalItemCount; i++) {
        if(idToMarketItem[i+1].owner == msg.sender) {
            itemCount++;
        }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);

    for (uint256 i=0; i<totalItemCount; i++) {
        if(idToMarketItem[i+1].owner ==  msg.sender) {
            uint256 currentId = i+1;
            MarketItem storage currentItem = idToMarketItem[currentId];
            items[currentIndex] = currentItem;

            currentIndex++;

        }
    }
    return items;
}


function fetchItemCreated() public view returns (MarketItem[] memory) {
    uint256 totalItemCount = _itemIds;
    uint256 itemCount = 0;
    uint256 currentIndex = 0;

    for(uint256 i=0; i<totalItemCount; i++) {
        if(idToMarketItem[i+1].seller ==  msg.sender) {
            itemCount++;
        }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);

    for(uint256 i=0; i<totalItemCount; i++) {
        if(idToMarketItem[i+1].seller ==  msg.sender) {
            uint256 currentId = i+1;

            MarketItem storage currentItem = idToMarketItem[currentId];
            items[currentIndex] = currentItem;

            currentIndex++;
        }
    }
    return items;
}


}