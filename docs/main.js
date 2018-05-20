const Settings = {
	// network: 3		// Ropsten
	network: 1		// Main
} 
const ABI = [{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_fee","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"_fee","type":"uint256"}],"name":"setFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_totalSupply","type":"uint256"}],"name":"generateToken","outputs":[{"name":"","type":"address"}],"payable":true,"stateMutability":"payable","type":"function"}];
// const ADDRESS = '0x9bfae2c6a526f91c1bdf8f6bf856940d425ba952';	// Ropsten
const ADDRESS = '0x12b2ea423a5b8542c270cb8e53bf9d2381b63f22';	// Mainnet
const ETH_SCAN_URL = 'etherscan.io';
window.web3;
window.tokenGenerator = null;
window.account = null;

function initWeb3() {
	if (typeof web3 !== 'undefined') {
		web3 = new Web3(web3.currentProvider);
		return web3;
	} else {
		return null;
	}
}

function initTokenGenerator() {
	window.tokenGenerator = web3.eth.contract(ABI).at(ADDRESS);
}

function checkMetaMaskAccount() {
	var accountInterval = setInterval(function () {
		if (web3.eth.accounts[0] !== window.account) {
			console.log("Account changed");
			window.account = window.web3.eth.accounts[0];
			$('#step3-metamask-address').val(window.account);
		}
	}, 300);
}

function isMetaMaskLogin() {
	if (web3.eth.accounts[0]) {
		return true;
	} else {
		return false;
	}
}

function isInteger(x) {
	x = parseFloat(x);
    return Math.round(x) === x;
}

function isAscii(str) {
	if (str.match(/^[\u0020-\u007e]+$/)) {
		return true;
	} else {
		return false;
	}
}

function isValidTokenParams(params) {
	let isValid = true;
	if (params.name == "" || params.name == null || !isAscii(params.name)) {
		alert("正しいトークン名を入力してください");
		isValid = false;
	}

	if (params.symbol == "" || params.symbol == null || !isAscii(params.symbol)) {
		alert("正しいトークンシンボルを入力してください");
		isValid = false;
	}

	if (params.totalSupply <= 0 || !isInteger(params.totalSupply)) {
		alert("トークン供給量を1以上の整数で入力してください");
		isValid = false;
	}

	return isValid;
}

function getFee(callback) {
	window.tokenGenerator.fee(function (error, fee) {
		console.log(web3.fromWei(fee, 'ether').toString());
		callback(fee);
	});
}

function getGasPrice(callback) {
	web3.eth.getGasPrice(function(error, gasPrice) {
		console.log(gasPrice.toString(10));
		var gasPriceInGwei = web3.fromWei(gasPrice, 'gwei');
		console.log(gasPriceInGwei);
		callback(gasPrice);
	});
}

function createTxObject(fee, gasPrice) {
	return {
			from: window.account,
			value: fee,
			gasPrice: gasPrice
		}
}

function getEtherScanUrl() {
	if (Settings.network == 3) {
		return 'https://ropsten.' + ETH_SCAN_URL + '/';
	} else {
		return 'https://' + ETH_SCAN_URL + '/';
	}
}


function createToken(name, symbol, totalSupply) {
	getFee(function (fee) {
		getGasPrice(function (gasPrice) {
			const txObject = createTxObject(fee, gasPrice);
			window.tokenGenerator.generateToken(
				name, symbol, totalSupply, txObject, function(error, txHash) 
			{
				if (error) {
					alert("エラーが発生し、正常にトランザクションが実行されませんでした。");
					return;
				}
				console.log("tx hash:", txHash);
				$('#step5-tx-hash').val(txHash);
				$('#step6-tx-hash').val(txHash);
				const url = getEtherScanUrl() + 'tx/' + txHash;
				$('#etherscan-tx-link').attr('href', url);
			});
		});
	});
}

function registerCreateTokenButton() {
	$('#create-token').on('click', () => {
		console.log("Clicked create-token");
		if (!isMetaMaskLogin()) {
			alert("MetaMask にログインしてください。");
			return;
		}
		const name = $('#token-name').val();
		const symbol = $('#token-symbol').val();
		const totalSupply = $('#token-totalsupply').val();
		if (isValidTokenParams({name, symbol, totalSupply})) {
			createToken(
				name, 
				symbol, 
				web3.toWei(totalSupply, 'ether')
			);
		} else {
			return;
		}
	});
}

function getTokenAddress(txHash, callack) {
	web3.eth.getTransactionReceipt(txHash, function (error, obj) {
		if(error) {
			alert("エラーが発生しました。トランザクションハッシュが正しいか確認してください。");
			return;
		}
		console.log(obj);
		callack(obj.logs[0].address)
	});
}

function registerCheckTokenAddressButton() {
	$('#check-token').on('click', () => {
		const txHash = $('#step6-tx-hash').val();
		getTokenAddress(txHash, (tokenAddress) => {
			$('#step6-token-address').val(tokenAddress);
			const url = getEtherScanUrl() + 'token/' + tokenAddress;
			$('#etherscan-token-link').attr('href', url);
		});
	});
}

// 0x916ae7312614c4ce04155e37e00cbc19308aa0719e20767cb94ead20498b962d

$(function(){
	let web3 = initWeb3();
	if (web3 != null) {
		console.log(web3.version);
		initTokenGenerator();
		checkMetaMaskAccount();
		registerCreateTokenButton();
		registerCheckTokenAddressButton();
	}
	
});
