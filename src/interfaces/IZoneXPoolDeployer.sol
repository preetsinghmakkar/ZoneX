// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.14;

interface IZoneXPoolDeployer {
    struct PoolParameters {
        address factory;
        address token0;
        address token1;
        uint24 tickSpacing;
        uint24 fee;
    }

    function parameters()
        external
        returns (
            address factory,
            address token0,
            address token1,
            uint24 tickSpacing,
            uint24 fee
        );
}
