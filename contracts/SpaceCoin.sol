// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SpaceCoin is ERC20 {

    bool public tax;
    address public owner;
    address public treasury;
    uint constant maxSupply = 500000 * (10 ** 18);
    uint public supply;
    mapping(address => uint256) public balances;

    modifier onlyOwner {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    /** @dev Sets the name, symbol, and owner and creates initial supply of tokens
    */
    constructor(uint _initialSupply, address _treasury) ERC20("SpaceCoin", "SPC") {
        owner = msg.sender;
        treasury = _treasury;
        _mint(msg.sender, _initialSupply);
    }

    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply.
     *
     * Requires that the amount of tokens will not exceed the maximum
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     */
    function _mint(address account, uint amount) internal override {
        require((supply + amount) <= maxSupply, "OVER_MAX");

        _beforeTokenTransfer(address(0), account, amount);

        supply += amount;
        balances[account] += amount;
        emit Transfer(address(0), account, amount);

        _afterTokenTransfer(address(0), account, amount);
    }

    /**
     * @dev Mints more tokens; only the owner can do this
     */
    function increaseSupply(uint amount) external onlyOwner {
        _mint(msg.sender, amount);
    }

    /**
     * @dev Returns the amount of SpaceCoin tokens in existence.
     */
    function totalSupply() public view override returns (uint256) {
        return supply;
    }

    /**
     * @dev Returns the amount of SpaceCoin tokens owned by `account`.
     */
    function balanceOf(address account) public view virtual override returns (uint256) {
        return balances[account];
    }

    /**
     * @dev Moves `amount` of tokens from `sender` to `recipient`.
     *      2% of the tokens in the transfer moves to the treasury address if tax is on
     *
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `sender` must have a balance of at least `amount`.
     */
    function _transfer(address sender, address recipient, uint256 amount) internal override {
        
        _beforeTokenTransfer(sender, recipient, amount);

        uint256 senderBalance = balances[sender];
        require(senderBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            balances[sender] = senderBalance - amount;
        }
        
        if (tax) {
            uint256 oldAmt = amount;
            amount = amount * 98 / 100;
            balances[treasury] += oldAmt - amount;
        } 
        balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);

        _afterTokenTransfer(sender, recipient, amount);
    }

    /**
     * @dev Owner sets the 2% tax on every transfer on or off
     */
    function setTax(bool control) external onlyOwner {
        tax = control;
    } 
}