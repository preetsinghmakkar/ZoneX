import { useMemo } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { CONTRACT_ADDRESSES, ZONEX_QUOTER_ABI, ZONEX_FACTORY_ABI, ZONEX_MANAGER_ABI } from './contracts';
import type { QuoteParams, QuoteResult, SwapParams, MintParams, Address } from './types';

// Hook for getting swap quotes
export function useQuote(params: QuoteParams | null) {
  const chainId = useChainId();
  const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
  
  // Mock quote for development/testing when contracts aren't deployed
  const mockQuote = useMemo(() => {
    if (!params || params.amountIn === 0n) return null;
    
    // Simple mock conversion rate (1 ETH = 2000 USDC)
    const mockRate = 2000n;
    const amountOut = (params.amountIn * mockRate) / (10n ** 12n); // Adjust for decimal differences
    
    return {
      amountOut,
      sqrtPriceX96After: 0n,
      initializedTicksCrossed: 0,
      gasEstimate: 21000n,
    };
  }, [params]);

  const { data, isLoading, error, refetch } = useReadContract({
    address: addresses?.QUOTER,
    abi: ZONEX_QUOTER_ABI,
    functionName: 'quoteSingle',
    args: params ? [{
      tokenIn: params.tokenIn,
      tokenOut: params.tokenOut,
      fee: params.fee,
      amountIn: params.amountIn,
      sqrtPriceLimitX96: params.sqrtPriceLimitX96 || 0n
    }] : undefined,
    query: {
      enabled: false, // Disable real contract calls for now
      refetchInterval: 10000,
    }
  });

  const quote: QuoteResult | null = useMemo(() => {
    // Use mock quote for development
    if (mockQuote) return mockQuote;
    
    if (!data || !Array.isArray(data) || data.length < 3) return null;
    
    try {
      return {
        amountOut: data[0] as bigint,
        sqrtPriceX96After: data[1] as bigint,
        initializedTicksCrossed: data[2] as number,
        gasEstimate: data[3] as bigint || 0n,
      };
    } catch (err) {
      console.error('Error parsing quote data:', err);
      return null;
    }
  }, [data, mockQuote]);

  return { 
    quote, 
    isLoading: false, // Never loading for mock
    error: null, // No errors for mock
    refetch 
  };
}

// Hook for performing swaps
export function useSwap() {
  const chainId = useChainId();
  const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const swap = async (params: SwapParams) => {
    if (!writeContract || !addresses) throw new Error('Contract not available');
    
    const deadline = Math.floor(Date.now() / 1000) + (params.deadline || 1200);
    
    return writeContract({
      address: addresses.MANAGER,
      abi: ZONEX_MANAGER_ABI,
      functionName: 'swapSingle',
      args: [{
        tokenIn: params.tokenIn,
        tokenOut: params.tokenOut,
        fee: params.fee,
        amountIn: params.amountIn,
        sqrtPriceLimitX96: params.sqrtPriceLimitX96 || 0n,
      }],
    });
  };

  return {
    swap,
    hash,
    isLoading: isPending || isConfirming,
    isSuccess,
    error,
  };
}

// Hook for minting new liquidity positions
export function useMintPosition() {
  const chainId = useChainId();
  const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mint = async (params: MintParams) => {
    if (!writeContract || !addresses) throw new Error('Contract not available');
    
    return writeContract({
      address: addresses.MANAGER,
      abi: ZONEX_MANAGER_ABI,
      functionName: 'mint',
      args: [{
        tokenA: params.tokenA,
        tokenB: params.tokenB,
        fee: params.fee,
        lowerTick: params.lowerTick,
        upperTick: params.upperTick,
        amount0Desired: params.amount0Desired,
        amount1Desired: params.amount1Desired,
        amount0Min: params.amount0Min,
        amount1Min: params.amount1Min,
      }],
    });
  };

  return {
    mint,
    hash,
    isLoading: isPending || isConfirming,
    isSuccess,
    error,
  };
}

// Hook for getting pool information  
export function usePool(tokenA: Address, tokenB: Address, fee: number) {
  const chainId = useChainId();
  const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
  
  // Mock pool data for development
  const mockPool = useMemo(() => ({
    address: '0x0000000000000000000000000000000000000000' as Address,
    token0: { address: tokenA },
    token1: { address: tokenB },
    fee,
    liquidity: 1000000n,
  }), [tokenA, tokenB, fee]);

  return {
    pools: [mockPool],
    pool: mockPool,
    isLoading: false,
    error: null,
  };
}

// Hook for token approvals
export function useTokenApproval(tokenAddress: Address, spender: Address) {
  const { writeContract, data: hash, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const approve = async (amount: bigint) => {
    if (!writeContract) throw new Error('Write contract not available');
    
    return writeContract({
      address: tokenAddress,
      abi: [
        {
          "inputs": [
            {"internalType": "address", "name": "spender", "type": "address"},
            {"internalType": "uint256", "name": "amount", "type": "uint256"}
          ],
          "name": "approve",
          "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ],
      functionName: 'approve',
      args: [spender, amount],
    });
  };

  return {
    approve,
    hash,
    isLoading: isPending || isConfirming,
    isSuccess,
  };
}