"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getNftContract } from "@/lib/getContract";
import useWallet from "@/hooks/useWallet";
import useWeb3 from "@/hooks/useWeb3";

const MyNft = () => {
  const { currentAccount } = useWallet();
  const {listNft} = useWeb3();

  const [mintedNft, setMintedNft] = useState([]);
  const[loading, setLoading] = useState({});
  const [loadingPage, setLoadingPage] = useState(true);
  const[price, setPrice] = useState({});


  const fetchMintedNft = async () => {
    try {
      setLoadingPage(true);
      if (!currentAccount) return;
      const nftContract = getNftContract();
  
      const filter = nftContract.filters.Transfer(null, currentAccount);
      const events = await nftContract.queryFilter(filter);
  
      const tokenIds = events.map(event => event.args.tokenId.toString());
  
      // Remove duplicates 
      const uniqueTokenIds = [...new Set(tokenIds)];
  
      const nftData = await Promise.all(
        uniqueTokenIds.map(async (tokenId) => {
          try {
            const [owner, tokenURI] = await Promise.all([
              nftContract.ownerOf(tokenId),
              nftContract.tokenURI(tokenId),
            ]);
  
            if (owner.toLowerCase() !== currentAccount.toLowerCase()) {
              return null;
            }
  
            const response = await fetch(tokenURI);
            if (!response.ok) return null;
            const metadata = await response.json();
  
            return {
              tokenId,
              contractAddress: nftContract.address,
              image: metadata.image,
              name: metadata.name,
              description: metadata.description,
            };
          } catch (err) {
            console.error(`Failed to process token ${tokenId}:`, err);
            
          }
        })
      );
  
      setMintedNft(nftData.filter(Boolean));

      //this code is above line's alternative nftData.filter(item => item !== null && item !== undefined && item !== false);
    } catch (error) {
      console.error("Error fetching minted nft: ", error);
    }finally{
      setLoadingPage(false);
    }
  };
  

  const hanldeLising = async(nftAddress, tokenId, price) => {

    try{
        setLoading( prev => ({...prev, [tokenId]: true}));
        await listNft(nftAddress, tokenId, price);
        setLoading( prev => ({...prev, [tokenId]: false}));
        setPrice(prev => ({...prev, [tokenId]: ' '}));
        
    }catch(error){
        console.error("Listing failed: ", error);
        setLoading( prev => ({...prev, [tokenId]: false}));
        setPrice(prev => ({...prev, [tokenId]: ' '}));
    }
}

  useEffect(() => {
    if (currentAccount) {
      fetchMintedNft();
    }
  }, [currentAccount]);

  return (
    <div className="flex-1 h-auto bg-stone-900">
      <div className="px-4 md:px-16 lg:px-24 py-4 flex flex-col items-center">
        <h2 className="text-xl text-gray-200 font-bold">My NFT</h2>

        { loadingPage && (
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




        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4 mb-4">
          {mintedNft.map((item, index) => (
            <div key={index} className='flex flex-col items-center h-[340px] overflow-hidden rounded-lg shadow-md p-4 group'>
              <div className="relative">
              <Image
                src={item.image}
                alt={item.name}
                width="300"
                height="200"
                className="w-full h-60 object-cover rounded-lg"
              />
              <div className="absolute bottom-0 flex flex-col items-center overflow-hidden bg-gray-700 w-full py-4 px-2 rounded-b-lg transition-transform duration-300 translate-y-20 z-10">
                <h2 className="text-xl text-gray-200 text-center mb-2 font-bold">{item.name}</h2>
                {/* <p className="text-sm text-gray-200 text-center">{item.description}</p> */}
                <input type="number" placeholder="Price (ETH)" value={price[item.tokenId] || ''} onChange={(e) => setPrice(prev => ({...prev, [item.tokenId] : e.target.value}))}
                className=" px-4 py-1 w-full placeholder-gray-200 text-gray-200 border border-gray-300 outline-0 rounded-lg mb-2" required/>

                <button onClick={()=>hanldeLising(item.contractAddress, item.tokenId, price[item.tokenId])} disabled={loading[item.tokenId]} className="px-4 py-1.5 bg-blue-500 hover:bg-blue-700 mt-2 rounded-lg text-white cursor-pointer">{loading[item.tokenId]? 'Listing...' : 'List Now'}</button>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyNft;
