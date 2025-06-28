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
  const[price, setPrice] = useState({});

  const fetchMintedNft = async () => {
    try {
      if (!currentAccount) return;
      const nftContract = getNftContract();

      const filter = nftContract.filters.Transfer(null, currentAccount);
      const events = await nftContract.queryFilter(filter);

      const tokenData = [];

      for (const event of events) {
        const tokenId = event.args.tokenId.toString();
        const currentOwner = await nftContract.ownerOf(tokenId);
        if (currentOwner.toLowerCase() === currentAccount.toLowerCase()) {
          const tokenUri = await nftContract.tokenURI(tokenId);
         
            const response = await fetch(tokenUri);
            if(!response.ok) continue;
            const metadata = await response.json();

            tokenData.push({
              tokenId: tokenId,
              contractAddress : nftContract.address,
              image: metadata.image,
              name: metadata.name,
              description: metadata.description,
            });
          
        }
      }

      setMintedNft(tokenData);
    } catch (error) {
      console.error("Error fetching minted nft: ", error);
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
