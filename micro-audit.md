https://github.com/dlk61/ICO

The following is a micro audit of git commit 23236b47c745e8afdaebe579e4920a98102c3c37 by Gilbert.


## General comments

- You're re-implementing a lot of OpenZeppelin's functionality in SpaceCoin.sol. Make use of the `super` keyword in `_mint` and `_transfer` so you don't have to.
- SpaceCoin mints an initial supply to the owner. It might be better to mint to the ICO itself so users can feel safer buying tokens from a contract rather than someone's personal address.
- Good changePhase function.


## issue-1

**[Medium]** whitelist is not manageable

ICO.sol accepts `addrs` as a parameter. However, it's highly likely that the ICO owner will want to add or remove addresses during the seed phase.

Consider adding a function to add or remove addresses from the whitelist.


## Nitpicks

- ICO.sol:99 can use a revert message.