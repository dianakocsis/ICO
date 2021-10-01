require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/be9dead4a18048a8b242e157e38015fb", //Infura url with projectId
      accounts: ["3e8c6b8420c25dbd909c18a0417a2e5ab8f83836e713af63a05830f3a0008444"] // add the account that will deploy the contract (private key)
     },
    hardhat: {
      chainId: 1337,
      accounts: {
        count: 28,
      },
    },
  },
};

