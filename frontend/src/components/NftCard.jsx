'use client'
import { ethers } from 'ethers'
import React from 'react'
import Image from 'next/image'

const NftCard = ({nft, onBuy}) => {
  return (
    <div className='flex flex-col items-center h-[340px] overflow-hidden rounded-lg shadow-md p-4 group'>
      <div className='relative'>
      <Image src={nft.image} alt={nft.name} width='300' height='200' className='w-full h-60 overflow-hidden object-cover rounded-lg' />
       <div className='absolute bottom-0 flex flex-col items-center bg-gray-700 w-full py-4 z-10 rounded-b-lg transition-transform duration-300 group-hover:translate-y-20 translate-y-34'>
       <h3 className='text-lg font-semibold text-gray-200 text-center'>{nft.name}</h3>
        <p className='text-sm text-gray-300 text-center'>{nft.description}</p>
        <p className='mt-2 font-bold text-center text-white'>{ethers.utils.formatEther(nft.price)} ETH</p>
        <button className='mt-3 px-4 py-1.5 bg-yellow-300 rounded hover:bg-yellow-500 cursor-pointer transition-transform duration-300' onClick={onBuy}>Buy Now</button>
       </div>
      </div>
    </div>
  )
}

export default NftCard