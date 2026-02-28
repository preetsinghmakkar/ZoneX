import { Address } from 'viem';
import { mainnet, sepolia, arbitrum, polygon } from './wagmi';

// Smart Contract Addresses - Update these after deployment
export const CONTRACT_ADDRESSES = {
  [mainnet.id]: {
    FACTORY: '0x0000000000000000000000000000000000000000' as Address,
    MANAGER: '0x0000000000000000000000000000000000000000' as Address,
    QUOTER: '0x0000000000000000000000000000000000000000' as Address,
  },
  [sepolia.id]: {
    FACTORY: '0x0000000000000000000000000000000000000000' as Address,
    MANAGER: '0x0000000000000000000000000000000000000000' as Address,
    QUOTER: '0x0000000000000000000000000000000000000000' as Address,
  },
  [arbitrum.id]: {
    FACTORY: '0x0000000000000000000000000000000000000000' as Address,
    MANAGER: '0x0000000000000000000000000000000000000000' as Address,
    QUOTER: '0x0000000000000000000000000000000000000000' as Address,
  },
  [polygon.id]: {
    FACTORY: '0x0000000000000000000000000000000000000000' as Address,
    MANAGER: '0x0000000000000000000000000000000000000000' as Address,
    QUOTER: '0x0000000000000000000000000000000000000000' as Address,
  },
} as const;

// ZoneXFactory ABI (based on your smart contract)
export const ZONEX_FACTORY_ABI = [
  {
    type: 'function',
    name: 'createPool',
    inputs: [
      { name: 'tokenX', type: 'address', internalType: 'address' },
      { name: 'tokenY', type: 'address', internalType: 'address' },
      { name: 'fee', type: 'uint24', internalType: 'uint24' },
    ],
    outputs: [
      { name: 'pool', type: 'address', internalType: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'pools',
    inputs: [
      { name: 'token0', type: 'address', internalType: 'address' },
      { name: 'token1', type: 'address', internalType: 'address' },
      { name: 'fee', type: 'uint24', internalType: 'uint24' },
    ],
    outputs: [
      { name: 'pool', type: 'address', internalType: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'fees',
    inputs: [
      { name: 'fee', type: 'uint24', internalType: 'uint24' },
    ],
    outputs: [
      { name: 'tickSpacing', type: 'int24', internalType: 'int24' },
    ],
    stateMutability: 'view',
  },
] as const;

// ZoneXManager ABI (based on your smart contract)
export const ZONEX_MANAGER_ABI = [
  {
    type: 'function',
    name: 'mint',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        internalType: 'struct IZoneXManager.MintParams',
        components: [
          { name: 'tokenA', type: 'address', internalType: 'address' },
          { name: 'tokenB', type: 'address', internalType: 'address' },
          { name: 'fee', type: 'uint24', internalType: 'uint24' },
          { name: 'lowerTick', type: 'int24', internalType: 'int24' },
          { name: 'upperTick', type: 'int24', internalType: 'int24' },
          { name: 'amount0Desired', type: 'uint256', internalType: 'uint256' },
          { name: 'amount1Desired', type: 'uint256', internalType: 'uint256' },
          { name: 'amount0Min', type: 'uint256', internalType: 'uint256' },
          { name: 'amount1Min', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    outputs: [
      { name: 'amount0', type: 'uint256', internalType: 'uint256' },
      { name: 'amount1', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'swapSingle',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        internalType: 'struct IZoneXManager.SwapSingleParams',
        components: [
          { name: 'tokenIn', type: 'address', internalType: 'address' },
          { name: 'tokenOut', type: 'address', internalType: 'address' },
          { name: 'fee', type: 'uint24', internalType: 'uint24' },
          { name: 'amountIn', type: 'uint256', internalType: 'uint256' },
          { name: 'sqrtPriceLimitX96', type: 'uint160', internalType: 'uint160' },
        ],
      },
    ],
    outputs: [
      { name: 'amountOut', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'swap',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        internalType: 'struct IZoneXManager.SwapParams',
        components: [
          { name: 'path', type: 'bytes', internalType: 'bytes' },
          { name: 'amountIn', type: 'uint256', internalType: 'uint256' },
          { name: 'amountOutMin', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    outputs: [
      { name: 'amountOut', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
] as const;

// ZoneXQuoter ABI (based on your smart contract)
export const ZONEX_QUOTER_ABI = [
  {
    type: 'function',
    name: 'quote',
    inputs: [
      { name: 'path', type: 'bytes', internalType: 'bytes' },
      { name: 'amountIn', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [
      { name: 'amountOut', type: 'uint256', internalType: 'uint256' },
      { name: 'sqrtPriceX96AfterList', type: 'uint160[]', internalType: 'uint160[]' },
      { name: 'initializedTicksCrossedList', type: 'uint32[]', internalType: 'uint32[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'quoteSingle',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        internalType: 'struct IZoneXQuoter.QuoteSingleParams',
        components: [
          { name: 'tokenIn', type: 'address', internalType: 'address' },
          { name: 'tokenOut', type: 'address', internalType: 'address' },
          { name: 'fee', type: 'uint24', internalType: 'uint24' },
          { name: 'amountIn', type: 'uint256', internalType: 'uint256' },
          { name: 'sqrtPriceLimitX96', type: 'uint160', internalType: 'uint160' },
        ],
      },
    ],
    outputs: [
      { name: 'amountOut', type: 'uint256', internalType: 'uint256' },
      { name: 'sqrtPriceX96After', type: 'uint160', internalType: 'uint160' },
      { name: 'initializedTicksCrossed', type: 'uint32', internalType: 'uint32' },
    ],
    stateMutability: 'view',
  },
] as const;

// ZoneXPool ABI (key functions for frontend integration)
export const ZONEX_POOL_ABI = [
  {
    type: 'function',
    name: 'slot0',
    inputs: [],
    outputs: [
      { name: 'sqrtPriceX96', type: 'uint160', internalType: 'uint160' },
      { name: 'tick', type: 'int24', internalType: 'int24' },
      { name: 'observationIndex', type: 'uint16', internalType: 'uint16' },
      { name: 'observationCardinality', type: 'uint16', internalType: 'uint16' },
      { name: 'observationCardinalityNext', type: 'uint16', internalType: 'uint16' },
      { name: 'feeProtocol', type: 'uint8', internalType: 'uint8' },
      { name: 'unlocked', type: 'bool', internalType: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'liquidity',
    inputs: [],
    outputs: [
      { name: '', type: 'uint128', internalType: 'uint128' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'token0',
    inputs: [],
    outputs: [
      { name: '', type: 'address', internalType: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'token1',
    inputs: [],
    outputs: [
      { name: '', type: 'address', internalType: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'fee',
    inputs: [],
    outputs: [
      { name: '', type: 'uint24', internalType: 'uint24' },
    ],
    stateMutability: 'view',
  },
] as const;

// ERC20 ABI for token operations
export const ERC20_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      { name: 'owner', type: 'address', internalType: 'address' },
      { name: 'spender', type: 'address', internalType: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transfer',
    inputs: [
      { name: 'to', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'symbol',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'name',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'view',
  },
] as const;