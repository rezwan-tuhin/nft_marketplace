'use client'
import NftCard from '@/components/NftCard'
import { getMarketplaceContract, getNftContract } from '@/lib/getContract';
import React, { useEffect, useState } from 'react'

const Home = () => {

  const [nft, setNft] = useState([]);

useEffect(() => {
  const fetchNft = async() => {
    try{
      const marketplaceContract = getMarketplaceContract();
      const nftContract= getNftContract();
      const nfts = await marketplaceContract.fetchMarketItems();
      const nftDetails = await Promise.all(
        nfts.map(async (item) =>{
          const tokenURI = await nftContract.tokenURI(item.tokenId);

          const response = await fetch(tokenURI);
          const metadata = await response.json();

          return {
            tokenId: item.tokenId.toString(),
            price: item.price.toString(),
            seller: item.seller,
            owner: item.owner,
            image: metadata.image,
            name: metadata.name,
            description: metadata.description,
          }
        })
      );

      setNft(nftDetails);
    }catch(error) {
      console.error("error fetching NFT: ", error);
    }
  }
  fetchNft();
}, []);

console.log(nft);



  const handleBuy = async(itemId, price) => {
    //buy code will be here
  }
  return (
    <div className='flex-1 bg-stone-900 h-auto'>
     

      <h2 className='text-white text-center py-4 text-2xl font-bold'>NFT Marketplace</h2>

      <div className='px-4 md:px-16 lg:px-24 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6'>

        {
          nft.map((item) => (
            <div key={Number(item.tokenId)}>
              <NftCard nft={item} onBuy = {handleBuy} />
            </div>
          ))
        }
        
      </div>
    </div>
  )
}

export default Home;