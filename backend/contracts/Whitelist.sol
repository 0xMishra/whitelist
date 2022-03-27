//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Whitelist {
  uint256 public maxWhitelistAddresses;
  mapping(address => bool) public whitelistAddresses;

  constructor(uint256 _maxWhitelist) {
    maxWhitelistAddresses = _maxWhitelist;
  }

  uint256 public numberOfWhitelistedAddresses;

  function addToWhitelist() public {
    require(
      !whitelistAddresses[msg.sender],
      "The address is already in whitelist"
    );
    require(
      numberOfWhitelistedAddresses < maxWhitelistAddresses,
      "Whitelist exceeded the limit"
    );
    whitelistAddresses[msg.sender] = true;
    numberOfWhitelistedAddresses++;
  }
}
