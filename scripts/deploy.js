const hre = require("hardhat"); //import the hardhat

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const initialSupply = '200000000000000000000000';
    const treasuryAddress = '0x80584B69e51DAE0D0b03BE93EBc014FAAB6D15dF';

    const SpaceCoin = await hre.ethers.getContractFactory("SpaceCoin");
    const spaceCoin = await SpaceCoin.deploy(initialSupply, treasuryAddress);

    const ICO = await hre.ethers.getContractFactory("ICO");
    const ico = await ICO.deploy(['0x15d34aaf54267db7d7c367839aaf71a00a2c6a65'], spaceCoin.address);

    await spaceCoin.deployed();
    await ico.deployed();
  
    console.log("SpaceCoin deployed to:", spaceCoin.address);
    console.log("ICO deployed to:", ico.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });