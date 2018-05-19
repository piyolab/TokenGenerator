pragma solidity 0.4.21;
import 'openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract BaseToken is StandardToken {
	string public name;
	string public symbol;
	uint8 public constant decimals = 18;	// solium-disable-line uppercase

	// Constructor
	function BaseToken(
			string _name,
			string _symbol,
			address _owner,
			uint256 _totalSupply)
		public 
	{
		name = _name;
		symbol = _symbol;
		totalSupply_ = _totalSupply;
		balances[_owner] = _totalSupply;
		emit Transfer(0x0, msg.sender, _totalSupply);
	}
}
