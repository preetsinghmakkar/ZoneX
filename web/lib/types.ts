import type { Address, Hash } from 'viem';

export type { Address, Hash } from 'viem';

export interface Token {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
  isNative: boolean;
}

export interface Pool {
  address: Address;
  token0: Token;
  token1: Token;
  fee: number;
  sqrtPriceX96: bigint;
  tick: number;
  liquidity: bigint;
  observationIndex: number;
  observationCardinality: number;
  observationCardinalityNext: number;
  feeProtocol: number;
  unlocked: boolean;
}

export interface Position {
  id: string;
  owner: Address;
  pool: Pool;
  lowerTick: number;
  upperTick: number;
  liquidity: bigint;
  feeGrowthInside0LastX128: bigint;
  feeGrowthInside1LastX128: bigint;
  tokensOwed0: bigint;
  tokensOwed1: bigint;
}

export interface SwapParams {
  tokenIn: Address;
  tokenOut: Address;
  fee: number;
  amountIn: bigint;
  amountOutMinimum: bigint;
  sqrtPriceLimitX96?: bigint;
  deadline?: number;
}

export interface MintParams {
  tokenA: Address;
  tokenB: Address;
  fee: number;
  lowerTick: number;
  upperTick: number;
  amount0Desired: bigint;
  amount1Desired: bigint;
  amount0Min: bigint;
  amount1Min: bigint;
}

export interface QuoteParams {
  tokenIn: Address;
  tokenOut: Address;
  fee: number;
  amountIn: bigint;
  sqrtPriceLimitX96?: bigint;
}

export interface QuoteResult {
  amountOut: bigint;
  sqrtPriceX96After: bigint;
  initializedTicksCrossed: number;
  gasEstimate?: bigint;
}

export interface TransactionState {
  hash?: Hash;
  loading: boolean;
  error?: Error;
  success: boolean;
}
