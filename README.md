# The SpaceCoin Token Contract Project

## Project Spec

OpenZeppelin has a contract library for ERC-20 (docs). Use this library when creating your token. You should use the token symbol SPC, which is how we're going to refer to SpaceCoin for most of this document.

This token should have:

- 500,000 max total supply - 150_000 of the SPC should be minted to the ICO contract (see below) - The remaining 350_000 SPC should be minted to the treasury1 account
  &nbsp;

- A 2% tax on every transfer
  - The taxed SPC should go to the treasury account
  - The 2% tax should be deducted from the amount sent in the transfer (i.e. if amount = 100, then 2 will be sent to the treasury, and the recipient will receive 98 SPC)
  - There must be a function that toggles this tax on/off, controllable by owner, initialized to false
  - When the 2% tax is on the tax should apply to all transfers, regardless of sender or receiver

# The ICO Contract Project

## Project Spec

The ICO should have:

- Functionality for any address to contribute ETH to the ICO
  &nbsp;

- Functionality for any address that previously contributed funds to redeem their ETH for SPC at a ratio of 1:5 in the OPEN phase - e.g. if Bob contributes 1 wei of ETH, he should get back 5 wei of SPC, and if Alice contributes 3 ETH, she should get back 15 SPC
  &nbsp;

> The spec intentionally does not include functionality for the ICO treasury to withdraw the contributed Ether. You'll be extending these contracts in a future project on liquidity pools, and withdrawals to the treasury will be the first feature you build. You can (and should) omit this feature for now.
> &nbsp;

- 3 phases (SEED, GENERAL, OPEN) - There must be a function, controllable by owner, that advances the ICO contract through the phases one-by-one (no skipping!) - The function should protect the owner from accidentally calling it twice2 (one way to implement this is through a compare and swap algo) - SEED phase - Only addresses in the allowlist (see below) may contribute in this phase - An individual contribution limit of 1_500 ETH
  A total contributors SEED phase limit of 15_000 ETH - GENERAL phase - any address may contribute in this phase - An individual limit of 1_000 ETH - A total contributors GENERAL phase limit of 30_000 ETH - OPEN phase - A total contributors OPEN phase limit of 30_000 ETH - any contributions that attempt to surpass these limits should revert
  &nbsp;

> When checking the limits, you should look at the cumulative contributions across phases. For example, if someone contributes 1_250 ETH in SEED Phase, they will not be able to contribute in the GENERAL Phase because they will have already reached the 1_000 ETH individual limit for the SEED phase. Similarly, if the total contribution across all contributors after SEED phase is 10_000 ETH, then at most 20_000 ETH can be contributed in GENERAL phase because the total limit is 30_000 for the GENERAL phase.
> &nbsp;

> In practice, the "move a phase forwards" part is usually based on time rather than manual shifting. We have it this way for the purpose of the class.
> &nbsp;

- Functionality to pause certain functions: - contributing ETH - redeeming SPC
  &nbsp;

- An allowlist for contributors in the SEED phase:
  - Should be set once in the constructor
  - Should not allow existing allowlisted addresses to be removed
