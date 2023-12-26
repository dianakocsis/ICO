import { expect } from 'chai';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import {
  SpaceCoin__factory,
  SpaceCoin,
  ICO__factory,
  ICO,
} from '../typechain-types';

describe('ICO', function () {
  let SpaceCoin: SpaceCoin__factory;
  let ICO: ICO__factory;
  let spaceCoin: SpaceCoin;
  let ico: ICO;
  let owner: SignerWithAddress, treasury: SignerWithAddress;
  let addr1: SignerWithAddress,
    addr2: SignerWithAddress,
    addr3: SignerWithAddress,
    addr4: SignerWithAddress,
    addr5: SignerWithAddress,
    addr6: SignerWithAddress,
    addr7: SignerWithAddress,
    addr8: SignerWithAddress,
    addr9: SignerWithAddress,
    addr10: SignerWithAddress,
    addr11: SignerWithAddress,
    addr12: SignerWithAddress,
    addr13: SignerWithAddress,
    addr14: SignerWithAddress,
    addr15: SignerWithAddress,
    addr16: SignerWithAddress,
    addr17: SignerWithAddress,
    addr18: SignerWithAddress,
    addr19: SignerWithAddress,
    addr20: SignerWithAddress,
    addr21: SignerWithAddress,
    addr22: SignerWithAddress,
    addr23: SignerWithAddress,
    addr24: SignerWithAddress,
    addr25: SignerWithAddress,
    addr26: SignerWithAddress;

  this.beforeEach(async function () {
    [
      owner,
      treasury,
      addr1,
      addr2,
      addr3,
      addr4,
      addr5,
      addr6,
      addr7,
      addr8,
      addr9,
      addr10,
      addr11,
      addr12,
      addr13,
      addr14,
      addr15,
      addr16,
      addr17,
      addr18,
      addr19,
      addr20,
      addr21,
      addr22,
      addr23,
      addr24,
      addr25,
      addr26,
    ] = await ethers.getSigners();

    SpaceCoin = (await ethers.getContractFactory(
      'SpaceCoin'
    )) as SpaceCoin__factory;
    spaceCoin = (await SpaceCoin.deploy(owner.address, treasury.address, [
      addr1,
      addr2,
      addr3,
      addr4,
      addr5,
      addr6,
      addr7,
      addr8,
      addr9,
      addr10,
      addr11,
    ])) as SpaceCoin;
    await spaceCoin.waitForDeployment();

    ICO = (await ethers.getContractFactory('ICO')) as ICO__factory;
    ico = ICO.attach(await spaceCoin.ico()) as ICO;
  });

  it('Constructor', async function () {
    expect(await ico.owner()).to.equal(owner.address);
    expect(await ico.allowList(addr1)).to.equal(true);
    expect(await ico.allowList(addr2)).to.equal(true);
    expect(await ico.allowList(addr3)).to.equal(true);
    expect(await ico.allowList(addr4)).to.equal(true);
    expect(await ico.allowList(addr5)).to.equal(true);
    expect(await ico.allowList(addr6)).to.equal(true);
    expect(await ico.allowList(addr7)).to.equal(true);
    expect(await ico.allowList(addr8)).to.equal(true);
    expect(await ico.allowList(addr9)).to.equal(true);
    expect(await ico.allowList(addr10)).to.equal(true);
    expect(await ico.allowList(addr11)).to.equal(true);
    expect(await ico.allowList(addr12)).to.equal(false);
  });
});
