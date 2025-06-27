const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const pinataSecretKey = process.env.NEXT_PUBLIC_PINATA_API_SECRET;

export const uploadToPinata = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const options = JSON.stringify({
        cidVersion : 1,
    });

    formData.append("pinataOptions", options);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS",{
        method: "POST",
        headers: {
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretKey
        },
        body: formData
    });

    if (!res.ok) {
        throw new Error('Image upload failed');
      }

    const data = await res.json();

    return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
}

export const uploadJsonToPinata = async(metaData) => {
    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS",{
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretKey
        },
        body: JSON.stringify(metaData),
    });

    if (!res.ok) {
        throw new Error('Metadata upload failed');
      }


    const data = await res.json();

    return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
}