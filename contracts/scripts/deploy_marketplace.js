const hre = require('hardhat');


async function main(){
    const NFT_Marketplace = await hre.ethers.getContractFactory('Marketplace');
    // const NFT = await hre.ethers.getContractFactory('NFT');

    const nft_marketplace = await NFT_Marketplace.deploy();

    await nft_marketplace.waitForDeployment();

    console.log("nft_marketplace contract deployed to:", await nft_marketplace.getAddress());
}

main().then(()=> process.exit(0)).catch(err=>{
    console.error("Error deploying: ", err);
    process.exit(1);
});
