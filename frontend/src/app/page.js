"use client";
import NftCard from "@/components/NftCard";
import { getMarketplaceContract, getNftContract } from "@/lib/getContract";
import useWeb3 from "@/hooks/useWeb3";
import React, { useEffect, useState } from "react";

const Home = () => {
  const [nft, setNft] = useState([]);
  const [nftLoading, setNftLoading] = useState(true);
  const { buyNft } = useWeb3();

  useEffect(() => {
    const fetchNft = async () => {
      try {
        setNftLoading(true);
        const marketplaceContract = getMarketplaceContract();
        const nftContract = getNftContract();

        const marketItems = await marketplaceContract.fetchMarketItems();

        const nftDetails = await Promise.all(
          marketItems.map(async (item) => {
            try {
              const tokenId = item.tokenId.toString();
              const itemId = item.itemId.toString();
              const price = item.price.toString();

              const tokenURI = await nftContract.tokenURI(tokenId);
              if (!tokenURI) return null;

              const response = await fetch(tokenURI);
              if (!response.ok) return null;

              const metadata = await response.json();
              if (!metadata?.image || !metadata?.name) return null;

              return {
                itemId,
                tokenId,
                price,
                seller: item.seller,
                owner: item.owner,
                image: metadata.image,
                name: metadata.name,
                description: metadata.description,
              };
            } catch (error) {
              console.error(`Failed to load NFT ${item.tokenId}:`, error);
            }
          })
        );

        setNft(nftDetails.filter(Boolean)); // removes null values
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }finally{
        setNftLoading(false);
      }
    };

    fetchNft();
  }, []);

  const handleBuy = async (itemId, price) => {
    try {
      await buyNft(itemId, price);
    } catch (error) {
      console.log("Error buying nft: ", error);
    }
  };
  return (
    // nftLoading ? (
    //   <div className="flex-1 flex bg-stone-900 h-auto justify-center items-center text-white text-lg">
    //     Loading NFTs...
    //   </div>
    // ) :

    <div className="flex-1 bg-stone-900 h-auto">
      <h2 className="text-white text-center py-4 text-2xl font-bold">
        NFT Marketplace
      </h2>

     { nftLoading && (
          <div className="px-4 md:px-16 lg:px-24 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-700 rounded">
                <div className='flex flex-col items-center h-[340px] overflow-hidden rounded-lg shadow-md p-4'>
      <div className='relative'>
      <div className='w-[300px] h-[200px] overflow-hidden object-cover rounded-lg'> </div>
       <div className='flex flex-col items-center bg-gray-700 w-full py-4 z-10 rounded-b-lg'>
       <div className='w-4/12 h-4 bg-gray-500 border-1 border-gray-500 rounded-full'></div>
        <div className='w-8/12 h-6 mt-2 bg-gray-500 rounded-full'></div>
        <div className='w-4/12 h-4 mt-4 bg-gray-500 rounded-full'></div>

       </div>
      </div>
    </div>
        </div>
            ))}
          </div>
        )}

      <div className="px-4 md:px-16 lg:px-24 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
        {
        nft.map((item) => (
          <div key={Number(item.tokenId)}>
            <NftCard nft={item} onBuy={handleBuy} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
