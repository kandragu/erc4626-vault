// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";

contract VaultDonationAttack is ERC4626 {
    constructor(IERC20 asset) ERC4626(asset) ERC20("VaultToken", "VTK") {}
}
