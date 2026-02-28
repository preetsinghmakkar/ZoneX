import { Address } from 'viem';
import { mainnet, sepolia, arbitrum, polygon } from './wagmi';

// Supported chains
export const SUPPORTED_CHAINS = [mainnet.id, sepolia.id, arbitrum.id, polygon.id] as const;

// Fee tiers (based on your smart contract)
export const FEE_TIERS = [
  { fee: 500, tickSpacing: 10, label: '0.05%' },
  { fee: 3000, tickSpacing: 60, label: '0.3%' },
  { fee: 10000, tickSpacing: 200, label: '1.0%' },
] as const;

// Token definitions based on deployment script
export const COMMON_TOKENS = {
  [mainnet.id]: [
    {
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as Address,
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
      logoURI: '/tokens/weth.svg',
      isNative: false,
    },
    {
      address: '0xA0b86a33E6411b3F4b57Cb7Ec4FF711c9d8C8f6A' as Address,
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      logoURI: '/tokens/usdc.svg',
      isNative: false,
    },
    {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as Address,
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      logoURI: '/tokens/usdt.svg',
      isNative: false,
    },
    {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as Address,
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
      logoURI: '/tokens/dai.svg',
      isNative: false,
    },
    {
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' as Address,
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin',
      decimals: 8,
      logoURI: '/tokens/wbtc.svg',
      isNative: false,
    },
    {
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984' as Address,
      symbol: 'UNI',
      name: 'Uniswap',
      decimals: 18,
      logoURI: '/tokens/uni.svg',
      isNative: false,
    },
    {
      address: '0x514910771AF9Ca656af840dff83E8264EcF986CA' as Address,
      symbol: 'LINK',
      name: 'Chainlink',
      decimals: 18,
      logoURI: '/tokens/link.svg',
      isNative: false,
    },
    {
      address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9' as Address,
      symbol: 'AAVE',
      name: 'Aave',
      decimals: 18,
      logoURI: '/tokens/aave.svg',
      isNative: false,
    },
    {
      address: '0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1' as Address,
      symbol: 'ARB',
      name: 'Arbitrum',
      decimals: 18,
      logoURI: '/tokens/arb.svg',
      isNative: false,
    },
    {
      address: '0xc00e94Cb662C3520282E6f5717214004A7f26888' as Address,
      symbol: 'COMP',
      name: 'Compound',
      decimals: 18,
      logoURI: '/tokens/comp.svg',
      isNative: false,
    },
    {
      address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2' as Address,
      symbol: 'MKR',
      name: 'Maker',
      decimals: 18,
      logoURI: '/tokens/mkr.svg',
      isNative: false,
    },
    {
      address: '0xD533a949740bb3306d119CC777fa900bA034cd52' as Address,
      symbol: 'CRV',
      name: 'Curve DAO',
      decimals: 18,
      logoURI: '/tokens/crv.svg',
      isNative: false,
    },
    {
      address: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32' as Address,
      symbol: 'LDO',
      name: 'Lido DAO',
      decimals: 18,
      logoURI: '/tokens/ldo.svg',
      isNative: false,
    },
    {
      address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F' as Address,
      symbol: 'SNX',
      name: 'Synthetix',
      decimals: 18,
      logoURI: '/tokens/snx.svg',
      isNative: false,
    },
    {
      address: '0xae78736Cd615f374D3085123A210448E74Fc6393' as Address,
      symbol: 'rETH',
      name: 'Rocket Pool ETH',
      decimals: 18,
      logoURI: '/tokens/reth.svg',
      isNative: false,
    },
    {
      address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84' as Address,
      symbol: 'stETH',
      name: 'Lido Staked ETH',
      decimals: 18,
      logoURI: '/tokens/steth.svg',
      isNative: false,
    },
    {
      address: '0xBe9895146f7AF43049ca1c1AE358B0541Ea49704' as Address,
      symbol: 'cbETH',
      name: 'Coinbase Wrapped ETH',
      decimals: 18,
      logoURI: '/tokens/cbeth.svg',
      isNative: false,
    },
    {
      address: '0x4200000000000000000000000000000000000042' as Address,
      symbol: 'OP',
      name: 'Optimism',
      decimals: 18,
      logoURI: '/tokens/op.svg',
      isNative: false,
    },
    {
      address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0' as Address,
      symbol: 'MATIC',
      name: 'Polygon',
      decimals: 18,
      logoURI: '/tokens/matic.svg',
      isNative: false,
    },
    {
      address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933' as Address,
      symbol: 'PEPE',
      name: 'Pepe',
      decimals: 18,
      logoURI: '/tokens/pepe.svg',
      isNative: false,
    },
    {
      address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE' as Address,
      symbol: 'SHIB',
      name: 'Shiba Inu',
      decimals: 18,
      logoURI: '/tokens/shib.svg',
      isNative: false,
    },
  ],
  [sepolia.id]: [
    {
      address: '0x0000000000000000000000000000000000000001' as Address,
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
      logoURI: '/tokens/weth.svg',
      isNative: false,
    },
    {
      address: '0x0000000000000000000000000000000000000002' as Address,
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 18,
      logoURI: '/tokens/usdc.svg',
      isNative: false,
    },
    {
      address: '0x0000000000000000000000000000000000000003' as Address,
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 18,
      logoURI: '/tokens/usdt.svg',
      isNative: false,
    },
    {
      address: '0x0000000000000000000000000000000000000004' as Address,
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
      logoURI: '/tokens/dai.svg',
      isNative: false,
    },
    {
      address: '0x0000000000000000000000000000000000000005' as Address,
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin',
      decimals: 18,
      logoURI: '/tokens/wbtc.svg',
      isNative: false,
    },
    {
      address: '0x0000000000000000000000000000000000000006' as Address,
      symbol: 'UNI',
      name: 'Uniswap',
      decimals: 18,
      logoURI: '/tokens/uni.svg',
      isNative: false,
    },
    {
      address: '0x0000000000000000000000000000000000000007' as Address,
      symbol: 'LINK',
      name: 'Chainlink',
      decimals: 18,
      logoURI: '/tokens/link.svg',
      isNative: false,
    },
    {
      address: '0x0000000000000000000000000000000000000008' as Address,
      symbol: 'AAVE',
      name: 'Aave',
      decimals: 18,
      logoURI: '/tokens/aave.svg',
      isNative: false,
    },
    {
      address: '0x0000000000000000000000000000000000000009' as Address,
      symbol: 'ARB',
      name: 'Arbitrum',
      decimals: 18,
      logoURI: '/tokens/arb.svg',
      isNative: false,
    },
    {
      address: '0x000000000000000000000000000000000000000a' as Address,
      symbol: 'COMP',
      name: 'Compound',
      decimals: 18,
      logoURI: '/tokens/comp.svg',
      isNative: false,
    },
    {
      address: '0x000000000000000000000000000000000000000b' as Address,
      symbol: 'MKR',
      name: 'Maker',
      decimals: 18,
      logoURI: '/tokens/mkr.svg',
      isNative: false,
    },
    {
      address: '0x000000000000000000000000000000000000000c' as Address,
      symbol: 'CRV',
      name: 'Curve DAO',
      decimals: 18,
      logoURI: '/tokens/crv.svg',
      isNative: false,
    },
    {
      address: '0x000000000000000000000000000000000000000d' as Address,
      symbol: 'LDO',
      name: 'Lido DAO',
      decimals: 18,
      logoURI: '/tokens/ldo.svg',
      isNative: false,
    },
    {
      address: '0x000000000000000000000000000000000000000e' as Address,
      symbol: 'SNX',
      name: 'Synthetix',
      decimals: 18,
      logoURI: '/tokens/snx.svg',
      isNative: false,
    },
    {
      address: '0x000000000000000000000000000000000000000f' as Address,
      symbol: 'stETH',
      name: 'Lido Staked ETH',
      decimals: 18,
      logoURI: '/tokens/steth.svg',
      isNative: false,
    },
    {
      address: '0x0000000000000000000000000000000000000010' as Address,
      symbol: 'rETH',
      name: 'Rocket Pool ETH',
      decimals: 18,
      logoURI: '/tokens/reth.svg',
      isNative: false,
    },
    {
      address: '0x0000000000000000000000000000000000000011' as Address,
      symbol: 'cbETH',
      name: 'Coinbase Wrapped ETH',
      decimals: 18,
      logoURI: '/tokens/cbeth.svg',
      isNative: false,
    },
    {
      address: '0x0000000000000000000000000000000000000012' as Address,
      symbol: 'OP',
      name: 'Optimism',
      decimals: 18,
      logoURI: '/tokens/op.svg',
      isNative: false,
    },
    {
      address: '0x0000000000000000000000000000000000000013' as Address,
      symbol: 'MATIC',
      name: 'Polygon',
      decimals: 18,
      logoURI: '/tokens/matic.svg',
      isNative: false,
    },
    {
      address: '0x0000000000000000000000000000000000000014' as Address,
      symbol: 'PEPE',
      name: 'Pepe',
      decimals: 18,
      logoURI: '/tokens/pepe.svg',
      isNative: false,
    },
    {
      address: '0x0000000000000000000000000000000000000015' as Address,
      symbol: 'SHIB',
      name: 'Shiba Inu',
      decimals: 18,
      logoURI: '/tokens/shib.svg',
      isNative: false,
    },
  ],
  [arbitrum.id]: [
    // Arbitrum tokens - Add actual addresses
    {
      address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1' as Address,
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
      logoURI: '/tokens/weth.png',
      isNative: false,
    },
  ],
  [polygon.id]: [
    // Polygon tokens - Add actual addresses
    {
      address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619' as Address,
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
      logoURI: '/tokens/weth.png',
      isNative: false,
    },
  ],
} as const;

// Slippage options
export const SLIPPAGE_OPTIONS = [0.1, 0.5, 1.0, 2.0] as const;

// Default values
export const DEFAULT_SLIPPAGE = 0.5;
export const DEFAULT_DEADLINE = 20; // minutes
export const MINIMUM_LIQUIDITY = BigInt(1000);

// Tick constants (from your smart contract)
export const MIN_TICK = -887272;
export const MAX_TICK = -MIN_TICK;
export const MIN_SQRT_RATIO = BigInt('4295128739');
export const MAX_SQRT_RATIO = BigInt('1461446703485210103287273052203988822378723970342');

// Pool pairs (based on your deployment script)
export const POPULAR_POOLS = [
  {
    token0: 'WETH',
    token1: 'USDC',
    fee: 3000,
    name: 'WETH/USDC',
  },
  {
    token0: 'WETH',
    token1: 'UNI',
    fee: 3000,
    name: 'WETH/UNI',
  },
  {
    token0: 'WBTC',
    token1: 'USDT',
    fee: 3000,
    name: 'WBTC/USDT',
  },
  {
    token0: 'USDT',
    token1: 'USDC',
    fee: 500,
    name: 'USDT/USDC',
  },
] as const;

// Query keys for React Query
export const QUERY_KEYS = {
  POOL_DATA: (address: string) => ['pool', address] as const,
  USER_POSITIONS: (address: string) => ['positions', address] as const,
  TOKEN_PRICES: (...addresses: string[]) => ['prices', ...addresses] as const,
  QUOTE: (params: any) => ['quote', params] as const,
  TOKEN_BALANCE: (token: string, account: string) => ['balance', token, account] as const,
  ALLOWANCE: (token: string, owner: string, spender: string) => ['allowance', token, owner, spender] as const,
} as const;