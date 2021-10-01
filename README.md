The Space Coin Token

This token should have:

500,000 max total supply
Mintable by an owner
A 2% tax on every transfer that gets put into a treasury
A flag that toggles this tax on/off, controllable by owner, initialized to false


The ICO Contract

Here's the spec:

The smart contract aims to raise 30,000 Ether by performing an ICO. The ICO should only be available to whitelisted private investors starting in Phase Seed with a maximum total private contribution limit of 15,000 Ether and an individual contribution limit of 1,500 Ether. The ICO should become available to the general public during Phase General, with a total contribution limit equal to 30,000 Ether, inclusive of funds raised from the private phase. During this phase, the individual contribution limit should be 1,000 Ether, until Phase Open, at which point the individual contribution limit should be removed. At that point, the ICO contract should immediately release ERC20-compatible tokens for all contributors at an exchange rate of 5 tokens to 1 Ether. The owner of the contract should have the ability to pause and resume fundraising at any time, as well as move a phase forwards (but not backwards) at will.