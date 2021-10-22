
# Micro-audit

Done by: Gabriel Jimenez
Date: Oct 2 2021
Repo: https://github.com/dlk61/ICO
Commit: 88b07660c6109ef001d18a6e30424277dc4419b9


## issues

#### severity: high
The total contribution limit should not be removed when the open phase is reached:
```
function open() internal {
    uint tokenAmt = 5 * msg.value;
    spcToken.transferFrom(owner, msg.sender, tokenAmt);
}
```
recommendations: add the same require statement for total contribution that's on the general() function:
```
require(total + msg.value <= 30000 ether, "MAX_TOTAL_CONTRIBUTION");
```

##  Nitpicks / Code Quality

- Instead of overriding ERC20 functionality and copy pasting the same code, one could make use of the already existing functions by doing something like: 

```
function mint(address account, uint amount) internal {
    require(some condition);
    _mint(account, amount);
}

// This way, there's no need for an extra balance mapping, and the default balanceOf() 
// and totalSupply() provided by the ERC20 can be re-used, since this is 
// updated on all the _mint(), _transfer() or _burn() functions
```

- On the withdraw function, the contributions[msg.sender] are only set to 0 after the token transfer, in this case it doesn't open up for a reentrancy attack since no real eth transfer is occurring, however I think it's best practice to always follow the same check-effect-interaction pattern, the function could be changed like so:
```
function withdraw() external {
    require(contributions[msg.sender] > 0);
    require(phase == Phase.Open, "NOT READY");
    uint tokensToTransfer = contributions[msg.sender];
    contributions[msg.sender] = 0;
    spcToken.transferFrom(owner, msg.sender, 5 * tokensToTransfer);
}
```

- Most of the logic on the seed() and general() function could be generalized instead of hardcoding the value and using the same require statement twice:
```
require(contributions[msg.sender] + msg.value <= 1500 ether, "MAX_IND_CONTRIBUTION");
require(total + msg.value <= 15000 ether, "MAX_TOTAL_CONTRIBUTION");

// and

require(contributions[msg.sender] + msg.value <= 1000 ether, "MAX_IND_CONTRIBUTION");
require(total + msg.value <= 30000 ether, "MAX_TOTAL_CONTRIBUTION");

// This could be re-formatted so there's only one require statement that gets 
// the current limit from a view function, for example
```
