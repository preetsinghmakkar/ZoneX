// SPDX-License-Identifier: MIT

pragma solidity ^0.8.14;
import "../src/ZoneXPool.sol";

abstract contract TestUtils {
    function encodeError(
        string memory error
    ) internal pure returns (bytes memory encoded) {
        encoded = abi.encodeWithSignature(error);
    }

    function encodeExtra(
        address token0_,
        address token1_,
        address payer
    ) internal pure returns (bytes memory) {
        return
            abi.encode(
                ZoneXPool.CallbackData({
                    token0: token0_,
                    token1: token1_,
                    payer: payer
                })
            );
    }
}
