import { ethers } from "ethers";
import { marketplaceAbi, NFTAbi, marketpalce_address, nft_address } from "@/constants";

export function getProviderOrSigner(needSigner = false) {
    if(typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        if(needSigner) {
            return provider.getSigner();
        }
        return provider;
    }
    throw new Error("Please install metamask to interact with us");
}


export function getNftContract(needSigner = false) {
    const providerOrSigner = getProviderOrSigner(needSigner)
    
    return new ethers.Contract(nft_address, NFTAbi, providerOrSigner);
}

export function getMarketplaceContract(needSigner = false) {
    const providerOrSigner = getProviderOrSigner(needSigner);

    return new ethers.Contract(marketpalce_address, marketplaceAbi, providerOrSigner);
}
