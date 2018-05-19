var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = process.env.MNEMONIC;
var infuraAccessToken = process.env.INFURA_ACCESS_TOKEN;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
  	development: {
  		host: 'localhost',
  		port: 7545,
  		network_id: 5777
  	},
  	ropsten: {
  		provider: function() {
  			return new HDWalletProvider(
  				mnemonic,
  				'https://ropsten.infura.io/' + infuraAccessToken
  			);
  		},
  		network_id: 3,
  		gas: 2000000,
  		gasPrice: 20000000000	// 20 Gwei
  	}
  }
};
