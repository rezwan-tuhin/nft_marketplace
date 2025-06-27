const hre = require('hardhat');


async function main(){
    const NFT = await hre.ethers.getContractFactory('NFT');

    const nft = await NFT.deploy();

    await nft.waitForDeployment();

    console.log("nft contract deployed to:", await nft.getAddress());
}

main().then(()=> process.exit(0)).catch(err=>{
    console.error("Error deploying: ", err);
    process.exit(1);
});
