'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, arbitrum, polygon } from 'wagmi/chains';

// Define supported chains based on PRD requirements
export const supportedChains = [mainnet, sepolia, arbitrum, polygon] as const;

export const config = getDefaultConfig({
  appName: 'ZoneX - Professional DeFi Trading',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'default-project-id',
  chains: supportedChains,
  ssr: true, // Enable server-side rendering
});

// Chain-specific configuration
export const CHAIN_CONFIG = {
  [mainnet.id]: {
    name: 'Ethereum Mainnet',
    blockExplorer: 'https://etherscan.io',
    rpcUrl: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  [sepolia.id]: {
    name: 'Sepolia Testnet',
    blockExplorer: 'https://sepolia.etherscan.io',
    rpcUrl: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 },
  },
  [arbitrum.id]: {
    name: 'Arbitrum One',
    blockExplorer: 'https://arbiscan.io',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  [polygon.id]: {
    name: 'Polygon',
    blockExplorer: 'https://polygonscan.com',
    rpcUrl: 'https://polygon-rpc.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  },
} as const;

// Re-export for convenience
export { mainnet, sepolia, polygon, arbitrum };