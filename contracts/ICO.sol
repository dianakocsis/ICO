// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./SpaceCoin.sol";

contract ICO {

    enum Phase {
        Seed,
        General,
        Open
    }
    Phase public phase;
    IERC20 public spcToken;
    bool public paused;
    address public owner;
    address public spcOwner;
    mapping(address=>bool) whitelist; 
    mapping(address => bool) public allowList;
    mapping(address=>uint) contributions;
    uint public total;
    IERC20 public immutable spaceCoin;

    error OnlyOwner(address sender, address owner);

    /// @param _owner The owner of the contract
    /// @param _allowList The list of addresses allowed to contribute
    constructor(address _owner, SpaceCoin _spaceCoin, address[] memory _allowList) {
        owner = _owner;
        spaceCoin = _spaceCoin;
        for (uint i = 0; i < _allowList.length; i++) {
            allowList[_allowList[i]] = true;
        }
    }

    /// @dev Modifier to check if the sender is the owner
    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert OnlyOwner(msg.sender, owner);
        }
        _;
    }

    /** @dev Checks the phase state and adds the contribution to the specific contributor and total 
     *        amount. Adds the contributor to the array if not already on it
     *
     * Requirements:
     *    Fundraising is not paused
     *
     */
    function contribute() external payable {
        require(!paused, "PAUSED");

        if (phase == Phase.Seed) {
            seed();
        }
        else if (phase == Phase.General) {
            general();
        }
        else {
            open();
        }

        contributions[msg.sender] += msg.value;
        total += msg.value;
    }

    /** @dev 
     * Requirements:
     *
     *   Contributor is on the whitelist
     *   Contribution is not over the contributor's limit.
     *   Contribution is not over the total limit in the seed phase.
     */
    function seed() internal {
        require(whitelist[msg.sender], "NOT_ON_WHITELIST");
        require(contributions[msg.sender] + msg.value <= 1500 ether, "MAX_IND_CONTRIBUTION");
        require(total + msg.value <= 15000 ether, "MAX_TOTAL_CONTRIBUTION");
    }

    /** @dev Checks to see if contribution can be accepted in general phase.
     *
     * Requirements:
     *
     *   Contribution is not over the contributor's limit.
     *   Contribution is not over the total limit in the seed phase.
     */
    function general() internal {
        require(contributions[msg.sender] + msg.value <= 1000 ether, "MAX_IND_CONTRIBUTION");
        require(total + msg.value <= 30000 ether, "MAX_TOTAL_CONTRIBUTION");
    }

    /** @dev Releases 5 tokens to 1 Ether to the contributor
     */
    function open() internal {
        require(total + msg.value <= 30000 ether, "MAX_TOTAL_CONTRIBUTION");
        uint tokenAmt = 5 * msg.value;
        spcToken.transferFrom(owner, msg.sender, tokenAmt);
    }

    /** @dev Releases 5 tokens to 1 Ether to all the contributors
     */
    function withdraw() external {
        require(contributions[msg.sender] > 0);
        require(phase == Phase.Open, "NOT READY");
        spcToken.transferFrom(owner, msg.sender, 5 * contributions[msg.sender]);
        contributions[msg.sender] = 0;
    }

    /** @dev Owner can change the phase of the contract.
     *
     * Requirements:
     *
     *   Owner can only move the phase forward.
     */
    function changePhase(Phase _phase) external onlyOwner {
        require(_phase > phase, "MOVE_FORWARD");
        phase = _phase;
    }

    /**
     * @dev Owner can pause fundraising
     */
    function pause(bool _paused) external onlyOwner {
        paused = _paused;
    }

}