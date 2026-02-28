'use client'

import { useState, useMemo } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useQuote, useSwap, useTokenApproval } from '../lib/hooks';
import { COMMON_TOKENS } from '../lib/constants';
import { parseEther, formatUnits, parseUnits } from 'viem';
import type { Address } from '../lib/types';

export default function SwapInterface() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  // Get tokens for current chain, fallback to mainnet
  const chainTokens = COMMON_TOKENS[chainId as keyof typeof COMMON_TOKENS] || COMMON_TOKENS[1];
  
  const [selectedTokenIn, setSelectedTokenIn] = useState(0);
  const [selectedTokenOut, setSelectedTokenOut] = useState(1);
  const [amountIn, setAmountIn] = useState<string>('');
  const [slippage, setSlippage] = useState<number>(0.5);

  const tokenIn = chainTokens[selectedTokenIn];
  const tokenOut = chainTokens[selectedTokenOut];
  
  const fee = 3000; // 0.3%
  
  // Parse amount based on token decimals
  const amountInBigInt = useMemo(() => {
    if (!amountIn || !tokenIn) return 0n;
    try {
      return parseUnits(amountIn, tokenIn.decimals);
    } catch {
      return 0n;
    }
  }, [amountIn, tokenIn]);
  
  const { quote, isLoading: isQuoteLoading, error: quoteError } = useQuote(
    amountInBigInt > 0n && tokenIn && tokenOut ? {
      tokenIn: tokenIn.address,
      tokenOut: tokenOut.address,
      fee,
      amountIn: amountInBigInt,
      sqrtPriceLimitX96: 0n
    } : null
  );

  const { swap, isLoading: isSwapLoading, isSuccess } = useSwap();
  const { approve, isLoading: isApproving } = useTokenApproval(
    tokenIn?.address as Address, 
    chainTokens[0]?.address as Address
  );

  const handleSwap = async () => {
    if (!quote || !amountIn || !tokenIn || !tokenOut) return;
    
    try {
      const amountOutMinimum = quote.amountOut * BigInt(Math.floor((100 - slippage) * 100)) / 10000n;
      
      await swap({
        tokenIn: tokenIn.address,
        tokenOut: tokenOut.address,
        fee,
        amountIn: amountInBigInt,
        amountOutMinimum,
        sqrtPriceLimitX96: 0n,
      });
    } catch (error) {
      console.error('Swap failed:', error);
    }
  };

  const handleApprove = async () => {
    if (!amountIn || !tokenIn) return;
    
    try {
      await approve(amountInBigInt);
    } catch (error) {
      console.error('Approval failed:', error);
    }
  };

  const switchTokens = () => {
    setSelectedTokenIn(selectedTokenOut);
    setSelectedTokenOut(selectedTokenIn);
    setAmountIn('');
  };

  // Format output amount
  const formattedAmountOut = useMemo(() => {
    if (!quote || !tokenOut) return '0.0';
    try {
      return formatUnits(quote.amountOut, tokenOut.decimals);
    } catch {
      return '0.0';
    }
  }, [quote, tokenOut]);

  if (!isConnected) {
    return (
      <div className="glass-effect p-8 rounded-2xl border border-amber-500/20 max-w-md mx-auto">
        <h2 className="golden-text-gradient text-2xl font-bold mb-4 text-center">Connect Wallet</h2>
        <p className="text-gray-300 text-center mb-6">
          Connect your wallet to start trading on ZoneX
        </p>
        <div className="text-center">
          <button className="golden-gradient px-8 py-3 rounded-xl font-semibold text-black hover:shadow-lg hover:shadow-amber-500/25 transition-all">
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect p-6 rounded-2xl border border-amber-500/20 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="golden-text-gradient text-xl font-bold">Swap Tokens</h2>
        <div className="text-xs text-gray-400">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
      </div>

      {/* Token Input */}
      <div className="space-y-4">
        <div className="bg-black/20 rounded-xl p-4 border border-amber-500/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">From</span>
            <span className="text-xs text-gray-500">Balance: 0.00</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="0.0"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              className="flex-1 bg-transparent text-2xl font-semibold text-white outline-none"
            />
            <div className="flex items-center gap-2 bg-amber-500/10 rounded-lg px-3 py-2">
              <img 
                src={tokenIn?.logoURI || '/tokens/default.svg'} 
                alt={tokenIn?.symbol || 'Token'} 
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiM2MzdERUEiLz4KPHR0ZXh0IHg9IjEyIiB5PSIxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTAiPj88L3RleHQ+Cjwvc3ZnPg==';
                }}
              />
              <span className="font-semibold">{tokenIn?.symbol || 'SELECT'}</span>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={switchTokens}
            className="p-2 rounded-full bg-amber-500/20 hover:bg-amber-500/30 transition-colors"
          >
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* Token Output */}
        <div className="bg-black/20 rounded-xl p-4 border border-amber-500/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">To (estimated)</span>
            <span className="text-xs text-gray-500">Balance: 0.00</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 text-2xl font-semibold text-white">
              {isQuoteLoading ? (
                <div className="animate-pulse">Loading...</div>
              ) : quoteError ? (
                <div className="text-red-400 text-sm">Error loading price</div>
              ) : (
                formattedAmountOut
              )}
            </div>
            <div className="flex items-center gap-2 bg-blue-500/10 rounded-lg px-3 py-2">
              <img 
                src={tokenOut?.logoURI || '/tokens/default.svg'} 
                alt={tokenOut?.symbol || 'Token'} 
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiMyNzc1Q0EiLz4KPHR0ZXh0IHg9IjEyIiB5PSIxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTAiPj88L3RleHQ+Cjwvc3ZnPg==';
                }}
              />
              <span className="font-semibold">{tokenOut?.symbol || 'SELECT'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slippage Settings */}
      <div className="mt-4 p-3 bg-black/10 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Slippage Tolerance</span>
          <div className="flex gap-2">
            {[0.1, 0.5, 1.0].map((value) => (
              <button
                key={value}
                onClick={() => setSlippage(value)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  slippage === value
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {value}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Swap Actions */}
      <div className="mt-6 space-y-3">
        {!isConnected ? (
          <button className="w-full golden-gradient py-4 rounded-xl font-semibold text-black hover:shadow-lg hover:shadow-amber-500/25 transition-all">
            Connect Wallet
          </button>
        ) : (
          <>
            <button
              onClick={handleApprove}
              disabled={isApproving || !amountIn}
              className="w-full bg-amber-500/20 text-amber-400 py-3 rounded-xl font-semibold hover:bg-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isApproving ? 'Approving...' : 'Approve WETH'}
            </button>
            <button
              onClick={handleSwap}
              disabled={isSwapLoading || !quote || !amountIn}
              className="w-full golden-gradient py-4 rounded-xl font-semibold text-black hover:shadow-lg hover:shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSwapLoading ? 'Swapping...' : 'Swap'}
            </button>
          </>
        )}
      </div>

      {/* Transaction Status */}
      {isSuccess && (
        <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded-full"></div>
            <span className="text-green-400 font-medium">Swap Successful!</span>
          </div>
        </div>
      )}

      {/* Quote Details */}
      {quote && (
        <div className="mt-4 p-3 bg-black/10 rounded-lg text-xs text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>Price Impact</span>
            <span className="text-amber-400">&lt; 0.01%</span>
          </div>
          <div className="flex justify-between">
            <span>Minimum Received</span>
            <span>{formatUnits(quote.amountOut * 995n / 1000n, 6)} USDC</span>
          </div>
          <div className="flex justify-between">
            <span>Network Fee</span>
            <span>~$2.50</span>
          </div>
        </div>
      )}
    </div>
  );
}