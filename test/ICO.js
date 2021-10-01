const { Wallet } = require("@ethersproject/wallet");
const { expect } = require("chai");
const { ethers } = require("hardhat")

const { parseEther } = ethers.utils

describe("ICO contract", function () {
  let ICO;
  let ico;
  let SpaceCoin;
  let spaceCoin;
  let owner;
  let addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr9, addr10, addr11, addr12;
  let addr13, addr14, addr15, addr16, addr17, addr18, addr19, addr20, addr21, addr22, addr23, addr24, addr25, addr26;
  let treas;

  const initialSupply = '200000000000000000000000';

  beforeEach(async function () {
    ICO = await ethers.getContractFactory("ICO");
    [owner, treas, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr9, addr10, addr11, addr12, addr13, addr14, addr15, addr16, addr17, addr18,  addr19, addr20, addr21, addr22, addr23, addr24, addr25, addr26] = await ethers.getSigners();
    SpaceCoin = await ethers.getContractFactory("SpaceCoin");
    spaceCoin = await SpaceCoin.deploy(initialSupply, treas.address);
    ico = await ICO.deploy([addr1.address, addr2.address, addr3.address, addr4.address , addr5.address, addr6.address, addr7.address, addr8.address, addr9.address, addr10.address, addr11.address], spaceCoin.address);
    
  });

  describe("Deployment", function () {

    it("Should assign the right owner", async function () {
      expect(await ico.owner()).to.equal(owner.address);
    });

  })

  describe("ICO Paused", function () {

    it("Only owner should be allowed to pause or resume ICO", async function () {
      await expect(ico.connect(addr1).pause(true)).to.be.revertedWith("NOT_OWNER");
    })

    it("Cannot contribute if ICO paused", async function () {
      await ico.pause(true);
      await expect(ico.connect(addr1).contribute({
        value: parseEther("100.0")
      })).to.be.revertedWith("PAUSED");
    })

  })

  describe("Phase Seed", function () {

    it("Cannot contribute in Phase Seed if not on the whitelist", async function () {
      await expect(ico.connect(addr12).contribute({
        value: parseEther("100")
      })).to.be.revertedWith("NOT_ON_WHITELIST");
    })

    it("Cannot contribute in Phase Seed if individual contribution over 1500", async function () {

      await ico.connect(addr1).contribute({
        value: parseEther("1000")
      });

      await expect(ico.connect(addr1).contribute({
        value: parseEther("501")
      })).to.be.revertedWith("MAX_IND_CONTRIBUTION");
    })

    it("Cannot contribute in Phase Seed if total contribution over 15000", async function () {

      await ico.connect(addr1).contribute({
        value: parseEther("1500")
      });
      await ico.connect(addr2).contribute({
        value: parseEther("1500")
      });
      await ico.connect(addr3).contribute({
        value: parseEther("1500")
      });
      await ico.connect(addr4).contribute({
        value: parseEther("1500")
      });
      await ico.connect(addr5).contribute({
        value: parseEther("1500")
      });
      await ico.connect(addr6).contribute({
        value: parseEther("1500")
      });
      await ico.connect(addr7).contribute({
        value: parseEther("1500")
      });
      await ico.connect(addr8).contribute({
        value: parseEther("1500")
      });
      await ico.connect(addr9).contribute({
        value: parseEther("1500")
      });
      await ico.connect(addr10).contribute({
        value: parseEther("1500")
      });
      await expect(ico.connect(addr11).contribute({
        value: parseEther("1")
      })).to.be.revertedWith("MAX_TOTAL_CONTRIBUTION");

    })

  })

  describe("Phase General", function () {

    it("Cannot contribute in Phase General if individual contribution over 1000", async function () {

      await ico.changePhase(1);

      await ico.connect(addr1).contribute({
        value: parseEther("900")
      });

      await expect(ico.connect(addr1).contribute({
        value: parseEther("101")
      })).to.be.revertedWith("MAX_IND_CONTRIBUTION");
    })


    it("Cannot contribute in phase general if total contribution over 30K", async function () {

      await ico.connect(addr1).contribute({
        value: parseEther("1500")
      });
      await ico.connect(addr2).contribute({
        value: parseEther("1500")
      });
      await ico.connect(addr3).contribute({
        value: parseEther("1500")
      });
      await ico.connect(addr4).contribute({
        value: parseEther("1500")
      });
      await ico.connect(addr5).contribute({
        value: parseEther("1500")
      });
      await ico.connect(addr6).contribute({
        value: parseEther("1500")
      });
      await ico.connect(addr7).contribute({
        value: parseEther("1500")
      });
      await ico.connect(addr8).contribute({
        value: parseEther("1500")
      });
      await ico.connect(addr9).contribute({
        value: parseEther("1500")
      });
      await ico.connect(addr10).contribute({
        value: parseEther("1500")
      });
      await ico.changePhase(1);
      await ico.connect(addr11).contribute({
        value: parseEther("1000")
      });
      await ico.connect(addr12).contribute({
        value: parseEther("1000")
      });
      await ico.connect(addr13).contribute({
        value: parseEther("1000")
      });
      await ico.connect(addr14).contribute({
        value: parseEther("1000")
      });
      await ico.connect(addr15).contribute({
        value: parseEther("1000")
      });
      await ico.connect(addr16).contribute({
        value: parseEther("1000")
      });
      await ico.connect(addr17).contribute({
        value: parseEther("1000")
      });
      await ico.connect(addr18).contribute({
        value: parseEther("1000")
      });
      await ico.connect(addr19).contribute({
        value: parseEther("1000")
      });
      await ico.connect(addr20).contribute({
        value: parseEther("1000")
      });
      await ico.connect(addr21).contribute({
        value: parseEther("1000")
      });
      await ico.connect(addr22).contribute({
        value: parseEther("1000")
      });
      await ico.connect(addr23).contribute({
        value: parseEther("1000")
      });
      await ico.connect(addr24).contribute({
        value: parseEther("1000")
      });
      await ico.connect(addr25).contribute({
        value: parseEther("1000")
      });
      await expect(ico.connect(addr26).contribute({
        value: parseEther("1")
      })).to.be.revertedWith("MAX_TOTAL_CONTRIBUTION");


    })
  })

  describe("Phase Open", function () {

    it("Testing amount of tokens", async function () {

      spaceCoin.approve(ico.address, initialSupply);

      await ico.changePhase(2);
      await ico.connect(addr1).contribute({
        value: parseEther("1.5")
      });
      expect(await spaceCoin.balanceOf(addr1.address)).to.equal('7500000000000000000');
    })

  })

  describe("Phases", function () {

    it("Only owner should be allowed to change the phase of the ico", async function () {
      await expect(ico.connect(addr1).changePhase(1)).to.be.revertedWith("NOT_OWNER");
    })

    it("Can move to phase General from Phase Seed", async function () {
      await ico.changePhase(1);
      expect(await ico.phase()).to.equal(1);
    })

    it("Cannot move from phase Seed to Phase General", async function () {
      await ico.changePhase(1);
      await expect(ico.changePhase(0)).to.be.revertedWith("MOVE_FORWARD");
    })

  })

  describe("Withdraw", function () {

    it("When owner switches to Phase Open, contributors can withdraw", async function () {

      spaceCoin.approve(ico.address, initialSupply);

      await ico.connect(addr1).contribute({
        value: parseEther("1.5")
      });

      await ico.connect(addr2).contribute({
        value: parseEther("1.5")
      });

      await ico.changePhase(2);

      await ico.connect(addr1).withdraw();
      await ico.connect(addr2).withdraw();

      expect(await spaceCoin.balanceOf(addr1.address)).to.equal('7500000000000000000');
      expect(await spaceCoin.balanceOf(addr2.address)).to.equal('7500000000000000000');

    })

  })


})