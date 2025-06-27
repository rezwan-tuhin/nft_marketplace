'use client'
import nftImage from '@/assets/image/nft.png';
import Navbar from '@/components/Navbar'
import NftCard from '@/components/NftCard'
import React from 'react'

const page = () => {

 const nft = {
    image: nftImage,
    name: 'NFT Name',
    description: 'NFT description',
    price: 'NFT price'
  }

  const handleBuy = async() => {
    //buy code will be here
  }
  return (
    <div className='bg-stone-900 min-h-screen'>
      <Navbar />

      <h2 className='text-white text-center py-4 text-2xl font-bold'>NFT Marketplace</h2>

      <div className='px-4 md:px-16 lg:px-24 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6'>
        <NftCard nft={nft} onBuy = {handleBuy} />
        <NftCard nft={nft} onBuy = {handleBuy} />
        <NftCard nft={nft} onBuy = {handleBuy} />
        <NftCard nft={nft} onBuy = {handleBuy} />
        <NftCard nft={nft} onBuy = {handleBuy} />
        <NftCard nft={nft} onBuy = {handleBuy} />
        <NftCard nft={nft} onBuy = {handleBuy} />
        <NftCard nft={nft} onBuy = {handleBuy} />
      </div>
    </div>
  )
}

export default page