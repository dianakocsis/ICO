// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./SpaceCoin.sol";

contract ICO {

    enum Phase {
        SEED,
        GENERAL,
        OPEN
    }
    uint256 public constant MAX_INDIVIDUAL_SEED_LIMIT = 1500 ether;
    uint256 public constant MAX_TOTAL_SEED_LIMIT = 15000 ether;
    uint256 public constant MAX_INDIVIDUAL_GENERAL_LIMIT = 1000 ether;
    uint256 public constant MAX_CONTRIBUTION = 30000 ether;
    Phase public phase;
    IERC20 public spcToken;
    bool public paused;
    address public owner;
    address public spcOwner;
    mapping(address=>bool) whitelist; 
    mapping(address => bool) public allowList;
    mapping(address => uint256) public contributions;
    uint public total;
    IERC20 public immutable spaceCoin;
    uint256 public totalContribution;

    event Contributed(address indexed contributor, uint256 indexed amount);
    event PhaseAdvanced(Phase indexed newPhase);
    event Paused();

    error OnlyOwner(address sender, address owner);
    error CannotContribute(uint256 amount, uint256 limit);
    error AlreadyPaused();
    error CannotAdvance();

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

    /// @dev Modifier to check if the contract is paused
    modifier notPaused() {
        if (paused) {
            revert AlreadyPaused();
        }
        _;
    }

    /// @notice Contributes to the ICO
    /// @dev The contribution is only allowed if the contract is not paused
    function contribute() external payable notPaused {
        if (msg.value > availableToContribute(msg.sender)) {
            revert CannotContribute(msg.value, availableToContribute(msg.sender));
        }
        contributions[msg.sender] += msg.value;
        totalContribution += msg.value;
        emit Contributed(msg.sender, msg.value);
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
        require(phase == Phase.OPEN, "NOT READY");
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

    /// @notice Advances the phase
    /// @param _current The current phase
    /// @dev The phase can only be advanced if the sender is the owner
    function advancePhase(Phase _current) external onlyOwner {
        if (phase != _current) {
            revert CannotAdvance();
        }
        phase = Phase(uint8(_current) + 1);
        emit PhaseAdvanced(phase);
    }

    /// @notice Pauses the contract
    /// @dev The contract can only be paused if it is not already paused
    function pause() external onlyOwner notPaused {
        paused = true;
        emit Paused();
    }

    /// @notice Returns the amount available to contribute for a user
    /// @param _user The user to check
    /// @return The amount available to contribute
    function availableToContribute(address _user) public view returns (uint256) {
        if (phase == Phase.SEED) {
            if (!allowList[_user]) {
                return 0;
            }
            return min(MAX_INDIVIDUAL_SEED_LIMIT - contributions[_user], fundingCapacity());
        } else if (phase == Phase.GENERAL) {
            if (contributions[_user] < MAX_INDIVIDUAL_GENERAL_LIMIT) {
                return min(MAX_INDIVIDUAL_GENERAL_LIMIT - contributions[_user], fundingCapacity());
            }
            return 0;
        } else {
            return fundingCapacity();
        }
    }

    /// @notice Returns the amount of funding capacity left
    /// @return The amount of funding capacity left
    function fundingCapacity() public view returns (uint256) {
        if (phase == Phase.SEED) {
            return MAX_TOTAL_SEED_LIMIT - totalContribution;
        }
        return MAX_CONTRIBUTION - totalContribution;
    }

    /// @notice Returns the minimum of two numbers
    /// @param _a The first number
    /// @param _b The second number
    function min(uint256 _a, uint256 _b) internal pure returns (uint256) {
        return _a < _b ? _a : _b;
    }

}