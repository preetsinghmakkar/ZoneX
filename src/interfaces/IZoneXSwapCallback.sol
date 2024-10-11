// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

interface IZoneXSwapCallback {
    function zoneXSwapCallback(
        int256 amount0,
        int256 amount1,
        bytes calldata data
    ) external;
}
