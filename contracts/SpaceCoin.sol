// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ICO.sol";

contract SpaceCoin is ERC20 {

    bool public tax;
    address public immutable owner;
    address public immutable treasury;
    address payable public immutable ico;
    uint constant maxSupply = 500000 * (10 ** 18);
    uint public supply;
    mapping(address => uint256) public balances;

    modifier onlyOwner {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    /// @notice Mint tokens to the ICO and treasury
    /// @param _owner The owner of the contract
    /// @param _treasury The address of the treasury
    constructor(address _owner, address _treasury, address[] memory _allowList) ERC20("SpaceCoin", "SPC") {
        owner = _owner;
        ico = payable(address(new ICO(owner, this, _allowList)));
        treasury = _treasury;
        _mint(ico, 150_000 * 10 ** decimals());
        _mint(treasury, 350_000 * 10 ** decimals());
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
     * @dev Owner sets the 2% tax on every transfer on or off
     */
    function setTax(bool control) external onlyOwner {
        tax = control;
    }
}