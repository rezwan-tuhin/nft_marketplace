// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint256 private _tokenIds;

    address contractAddress;

    constructor(address marketplaceAddress) ERC721("CreativeNFT", "CNF") {
        contractAddress = marketplaceAddress;
    }

    //Mint new token

    function createToken(string memory tokenURI) public returns (uint256) {
        _tokenIds++;

        uint256 newItemId = _tokenIds;

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        setApprovalForAll(contractAddress, true);

        return newItemId;
    }
}