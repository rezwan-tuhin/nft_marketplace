'use client'
import React from 'react'
import useWallet from "@/hooks/useWallet";
import Link from 'next/link';

const Navbar = () => {
    const {currentAccount, connectWallet} = useWallet();
  return (
    <nav className='flex flex-col md:flex-row justify-between items-center py-4 px-4 md:px-16 lg:px-24 bg-stone-900 border-b-[0.1px] border-gray-500 text-white'>
        <div className='text-xl font-bold'>
            <Link href='/'>NFT Marketplace</Link>
        </div>

        <div className='space-x-4 text-sm mt-2 sm:mt-0 md:text-lg'>
            <Link href='/'>Home</Link>
           {
            currentAccount && (
              <>
              <Link href='/create'>Create NFT</Link>
              <Link href='/my-nft'>My NFT</Link>
              </>
              
            )
           }

            {currentAccount ? 
            <span className='bg-gray-700 px-3 py-1 rounded'>{currentAccount.slice(0,6)}...{currentAccount.slice(-4)}</span>:
            <button onClick={connectWallet} className='bg-gray-700 rounded px-8 py-1.5 cursor-pointer'>Connect Wallet</button>}
        </div>
    </nav>
  )
}

export default Navbar