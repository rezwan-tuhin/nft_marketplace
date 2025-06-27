'use client'
import React, { useState } from 'react'
import useWeb3 from '@/hooks/useWeb3';

const page = () => {
    const [nftAddress, setNftAddress] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [price, setPrice] = useState('');
    const [loading, setLoading] = useState(false);

    const {listNft} = useWeb3();

    const hanldeLising = async(e) => {
        e.preventDefault();

        try{
            setLoading(true);
            await listNft(nftAddress, tokenId, price);
            setLoading(false);
            setNftAddress('');
            setTokenId('');
            setPrice('');
            
        }catch(error){
            console.error("Listing failed: ", error);
            setLoading(false);
            setNftAddress('');
            setTokenId('');
            setPrice('');
        }
    }


  return (
    <div className='flex-1 h-auto px-4 md:px-16 lg:px-24 bg-stone-900 flex justify-center items-center'>
        <div className='flex flex-col py-4 w-full md:w-4/12'>
            <h2 className='text-center text-2xl text-gray-200 font-bold mb-2'>List Your NFT</h2>
            <input type='text' placeholder='NFT Contract address' value={nftAddress} onChange={(e) => setNftAddress(e.target.value)}
            className='w-full text-gray-200 placeholder-gray-200 mb-4 p-2 border border-gray-300 outline-0'/>

            <input type='number' placeholder='Token Id' value={tokenId} onChange={(e) => setTokenId(e.target.value)}
            className='w-full text-gray-200 placeholder-gray-200 mb-4 p-2 border border-gray-300 outline-0'/>


            <input type='number' placeholder='Price' value={price} onChange={(e) => setPrice(e.target.value)} 
            className='w-full text-gray-200 placeholder-gray-200 mb-4 p-2 border border-gray-300 outline-0'/>

            <button onClick={hanldeLising} disabled={loading} className='self-center px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer'>{loading? 'Listing...' : 'List NFT'}</button>
        </div>
    </div>
  )
}

export default page