import React from 'react'
import nftImage from '@/assets/image/nft.png';
import NftCard from '@/components/NftCard';

const page = () => {

  const nft = {
    image: nftImage,
    name: 'NFT Name',
    description: 'NFT description',
    price: 'NFT price'
  }
  return (
    <div className='flex-1 h-auto bg-stone-900'>
      <div className='px-4 md:px-16 lg:px-24 py-4 flex flex-col items-center'>
        {/* <h2 className='text-xl text-gray-200 font-bold'>Newly Mined Crypto</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4 mb-4'>
          <NftCard nft={nft}/>
          <NftCard nft={nft}/>
          <NftCard nft={nft}/>
          <NftCard nft={nft}/>
        </div> */}

        <h2 className='text-xl text-gray-200 font-bold'>My NFT</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4 mb-4'>
          <NftCard nft={nft}/>
          <NftCard nft={nft}/>
          <NftCard nft={nft}/>
          <NftCard nft={nft}/>
        </div>
      </div>
    </div>
  )
}

export default page