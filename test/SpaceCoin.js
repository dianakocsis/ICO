const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('SpaceCoin contract', function () {
  let SpaceCoin;
  let spaceCoin;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addr4;
  let addr5;
  let treasury;

  const initialSupply = '200000000000000000000000';

  beforeEach(async function () {
    SpaceCoin = await ethers.getContractFactory('SpaceCoin');
    [owner, treasury, addr1, addr2, addr3, addr4, addr5] =
      await ethers.getSigners();
    spaceCoin = await SpaceCoin.deploy(owner.address, treasury.address, [
      addr1,
      addr2,
      addr3,
      addr4,
      addr5,
    ]);
  });

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      expect(await spaceCoin.owner()).to.equal(owner.address);
    });

    it('Should assign supply variable to the initial supply', async function () {
      expect(await spaceCoin.totalSupply()).to.equal(initialSupply);
    });

    it('Should assign initial supply to the balance of the owner', async function () {
      expect(await spaceCoin.balanceOf(owner.address)).to.equal(initialSupply);
    });
  });

  describe('Minting', function () {
    it('Can only be called by owner', async function () {
      await expect(
        spaceCoin.connect(addr1).increaseSupply(initialSupply)
      ).to.be.revertedWith('NOT_OWNER');
    });

    it('New minted amount added on to supply', async function () {
      await spaceCoin.increaseSupply('300000000000000000000000');
      expect(await spaceCoin.totalSupply()).to.equal(
        '500000000000000000000000'
      );
      expect(await spaceCoin.balanceOf(owner.address)).to.equal(
        '500000000000000000000000'
      );
    });

    it('Cannot exceed maximum amount of tokens', async function () {
      await expect(
        spaceCoin.increaseSupply('400000000000000000000000')
      ).to.be.revertedWith('OVER_MAX');
    });
  });

  describe('Setting tax', function () {
    it('Can only be called by owner', async function () {
      await expect(spaceCoin.connect(addr1).setTax(true)).to.be.revertedWith(
        'NOT_OWNER'
      );
    });

    it('Setting tax to true', async function () {
      await spaceCoin.setTax(true);
      expect(await spaceCoin.tax()).to.equal(true);
    });
  });

  describe('Transferring', function () {
    it('2 percent tax', async function () {
      await spaceCoin.setTax(true);
      await spaceCoin.transfer(addr1.address, '100000000000000000000000');
      expect(await spaceCoin.balanceOf(owner.address)).to.equal(
        '100000000000000000000000'
      );
      expect(await spaceCoin.balanceOf(addr1.address)).to.equal(
        '98000000000000000000000'
      );
      expect(await spaceCoin.balanceOf(spaceCoin.treasury())).to.equal(
        '2000000000000000000000'
      );
    });

    it('Without tax', async function () {
      await spaceCoin.transfer(addr1.address, '100000000000000000000000');
      expect(await spaceCoin.balanceOf(owner.address)).to.equal(
        '100000000000000000000000'
      );
      expect(await spaceCoin.balanceOf(addr1.address)).to.equal(
        '100000000000000000000000'
      );
      expect(await spaceCoin.balanceOf(spaceCoin.treasury())).to.equal(0);
    });
  });
});
