import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(value: number | bigint, decimals = 2): string {
  const num = typeof value === 'bigint' ? Number(value) : value;
  
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(decimals)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(decimals)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(decimals)}K`;
  }
  return num.toFixed(decimals);
}

export function formatCurrency(value: number | bigint, currency = 'USD'): string {
  const num = typeof value === 'bigint' ? Number(value) : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatTokenAmount(amount: bigint, decimals: number, displayDecimals = 6): string {
  const divisor = BigInt(10) ** BigInt(decimals);
  const quotient = amount / divisor;
  const remainder = amount % divisor;
  
  const quotientStr = quotient.toString();
  const remainderStr = remainder.toString().padStart(decimals, '0');
  const trimmedRemainder = remainderStr.slice(0, displayDecimals).replace(/0+$/, '');
  
  return trimmedRemainder ? `${quotientStr}.${trimmedRemainder}` : quotientStr;
}

export function parseTokenAmount(amount: string, decimals: number): bigint {
  const [integer, decimal = ''] = amount.split('.');
  const paddedDecimal = decimal.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(integer + paddedDecimal);
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getExplorerUrl(chainId: number, hash: string): string {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    137: 'https://polygonscan.com',
    42161: 'https://arbiscan.io',
  };
  
  return `${explorers[chainId] || explorers[1]}/tx/${hash}`;
}

export function calculatePriceImpact(
  inputAmount: bigint,
  outputAmount: bigint,
  inputPrice: number,
  outputPrice: number,
): number {
  const inputValue = Number(inputAmount) * inputPrice;
  const outputValue = Number(outputAmount) * outputPrice;
  
  if (inputValue === 0) return 0;
  
  return ((inputValue - outputValue) / inputValue) * 100;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): T {
  let timeout: NodeJS.Timeout;
  
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function getTokenLogoUrl(symbol: string): string {
  return `/tokens/${symbol.toLowerCase()}.png`;
}