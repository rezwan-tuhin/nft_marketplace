import { getNftContract, getMarketplaceContract } from "@/lib/getContract"
import { ethers } from "ethers";

export default function useWeb3() {

    const createNft = async () => {

    }

    const listNft = async(nftAddress, tokenId, price) => {
        try{

            if (!price || isNaN(price)) {
                throw new Error("Invalid price: must be a numeric string.");}
                
            const contract = getMarketplaceContract(true);
            const listingPrice = await contract.getListingPrice();
            const tx = await contract.createMarketItem(nftAddress, tokenId, ethers.utils.parseEther(price), {value: listingPrice});
            await tx.wait();
            alert("Listed Successfully");
        }catch(error) {
            console.error("Error listing Nft: ", error);
            alert('Listing failed');
        }
    }

    const buyNft = async (tokenId, price) => {
        try{
            const contract = getMarketplaceContract(true);

            const tx = contract.buyMarketItem(tokenId, {value: ethers.utils.parseEther(price)});
            await tx.wait();
        }catch(error) {
            console.error("Error buying NFT: ", error);
        }
    }

    return {listNft, buyNft};
}