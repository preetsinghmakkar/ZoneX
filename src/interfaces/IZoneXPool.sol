// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.14;

interface IZoneXPool {
    function slot0() external view returns (uint160 sqrtPriceX96, int24 tick);

    // @param - zeroForOne is the flag that controls swap direction: when true, token0 is traded in for token1; when false, it’s the opposite.
    // @param - amountSpecified is the number of tokens the user wants to sell.
    function swap(
        address recipient,
        bool zeroForOne,
        uint256 amountSpecified,
        bytes calldata data
    ) external returns (int256, int256);
}
