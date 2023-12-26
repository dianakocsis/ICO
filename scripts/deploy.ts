import hre, { ethers } from 'hardhat';
import {
  ICO,
  ICO__factory,
  SpaceCoin,
  SpaceCoin__factory,
} from '../typechain-types';

async function main() {
  const [deployer] = await ethers.getSigners();
  const treasury = ethers.Wallet.createRandom();

  const SpaceCoin = (await ethers.getContractFactory(
    'SpaceCoin'
  )) as SpaceCoin__factory;
  const spaceCoin = (await SpaceCoin.deploy(
    deployer.address,
    treasury.address,
    [deployer.address]
  )) as SpaceCoin;

  await spaceCoin.waitForDeployment();

  const ICO = (await ethers.getContractFactory('ICO')) as ICO__factory;
  const ico = ICO.attach(await spaceCoin.ico()) as ICO;

  await ico.waitForDeployment();

  console.log(`spacecoin deployed to ${spaceCoin.target}`);

  console.log(`ico deployed to ${ico.target}`);

  await spaceCoin.deploymentTransaction()?.wait(5);

  await hre.run('verify:verify', {
    address: spaceCoin.target,
    constructorArguments: [
      deployer.address,
      treasury.address,
      [deployer.address],
    ],
  });

  await hre.run('verify:verify', {
    address: ico.target,
    constructorArguments: [
      deployer.address,
      spaceCoin.target,
      [deployer.address],
    ],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
