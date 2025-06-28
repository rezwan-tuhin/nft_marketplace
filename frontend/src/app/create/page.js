'use client'
import React, { useState } from 'react'
import { uploadToPinata, uploadJsonToPinata } from '@/lib/pinata'
import { getNftContract } from '@/lib/getContract'

const Create = () => {

    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) setImage(file);
      };

    const handleMint = async (e) => {
      e.preventDefault();
        if (!image || !name || !description) {
          alert('All fields are required');
          return;
        }
    
        try {
          setLoading(true);
    
          const imageUrl = await uploadToPinata(image);

          const metadata = {
            name,
            description,
            image: imageUrl,
          };
    
          const tokenURI = await uploadJsonToPinata(metadata);
    
          const contract = getNftContract(true);
          const tx = await contract.createToken(tokenURI);
          await tx.wait();
    
          alert('NFT Minted Successfully!');
          setName('');
          setDescription('');
          setImage(null);
        } catch (err) {
          console.error(err);
          alert('Mint failed');
        } finally {
          setLoading(false);
        }
      };
    
  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-stone-900 px-4 md:px-16 lg:px-24 py-4 h-auto">
      <div className='flex flex-col w-full md:w-4/12'>
      <h1 className="text-3xl text-gray-200 font-bold mb-6">Mint NFT</h1>

<input
  type="file"
  accept="image/*"
  onChange={handleImageChange}
  className="w-full mb-4 p-2 border border-gray-200 file:text-gray-200 text-gray-200 cursor-pointer"
/>

<input
  type="text"
  placeholder="Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="w-full placeholder-gray-200 text-gray-200 mb-4 p-2 border border-gray-300 outline-0"
/>

<textarea
  placeholder="Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  className="w-full placeholder-gray-200  text-gray-200 mb-4 p-2 border border-gray-300 outline-0"
/>

<button
  onClick={handleMint}
  disabled={loading}
  className="self-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
>
  {loading ? 'Minting...' : 'Mint NFT'}
</button>
      </div>
    </div>
  )
}

export default Create;