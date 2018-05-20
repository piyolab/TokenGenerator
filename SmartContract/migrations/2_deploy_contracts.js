var TokenGenerator = artifacts.require("./TokenGenerator.sol");

const FEE = 0.01;

module.exports = function(deployer) {
  deployer.deploy(
  	TokenGenerator,
  	web3.toWei(FEE, 'ether')
  );
};
