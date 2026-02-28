'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useQuote, useSwap, useTokenApproval } from '@/lib/hooks';
import { COMMON_TOKENS } from '@/lib/constants';
import { parseUnits, formatUnits } from 'viem';
import { Search, X, Settings, ArrowDown, Check, Loader2 } from 'lucide-react';
import type { Address } from '@/lib/types';

const POPULAR_SYMBOLS = ['WETH', 'USDC', 'USDT', 'DAI', 'WBTC', 'UNI'];

export default function TradePage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const chainTokens = COMMON_TOKENS[chainId as keyof typeof COMMON_TOKENS] || COMMON_TOKENS[1];

  const [selectedTokenIn, setSelectedTokenIn] = useState(0);
  const [selectedTokenOut, setSelectedTokenOut] = useState(1);
  const [amountIn, setAmountIn] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [showTokenSelectFrom, setShowTokenSelectFrom] = useState(false);
  const [showTokenSelectTo, setShowTokenSelectTo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tokenSearch, setTokenSearch] = useState('');

  const tokenIn = chainTokens[selectedTokenIn];
  const tokenOut = chainTokens[selectedTokenOut];
  const fee = 3000;

  const filteredTokens = useMemo(() => {
    if (!tokenSearch) return chainTokens;
    const q = tokenSearch.toLowerCase();
    return chainTokens.filter(
      (t) => t.symbol.toLowerCase().includes(q) || t.name.toLowerCase().includes(q)
    );
  }, [chainTokens, tokenSearch]);

  const popularTokens = useMemo(
    () => chainTokens.filter((t) => POPULAR_SYMBOLS.includes(t.symbol)),
    [chainTokens]
  );

  const amountInBigInt = useMemo(() => {
    if (!amountIn || !tokenIn) return 0n;
    try { return parseUnits(amountIn, tokenIn.decimals); }
    catch { return 0n; }
  }, [amountIn, tokenIn]);

  const { quote, isLoading: isQuoteLoading } = useQuote(
    amountInBigInt > 0n && tokenIn && tokenOut
      ? { tokenIn: tokenIn.address, tokenOut: tokenOut.address, fee, amountIn: amountInBigInt, sqrtPriceLimitX96: 0n }
      : null
  );

  const { swap, isLoading: isSwapLoading, isSuccess } = useSwap();
  const { approve, isLoading: isApproving } = useTokenApproval(tokenIn?.address as Address, chainTokens[0]?.address as Address);

  const formattedAmountOut = useMemo(() => {
    if (!quote || !tokenOut) return '';
    try { return formatUnits(quote.amountOut, tokenOut.decimals); }
    catch { return ''; }
  }, [quote, tokenOut]);

  const switchTokens = useCallback(() => {
    setSelectedTokenIn(selectedTokenOut);
    setSelectedTokenOut(selectedTokenIn);
    setAmountIn('');
  }, [selectedTokenIn, selectedTokenOut]);

  const handleSwap = async () => {
    if (!quote || !amountIn || !tokenIn || !tokenOut) return;
    try {
      const amountOutMinimum = (quote.amountOut * BigInt(Math.floor((100 - slippage) * 100))) / 10000n;
      await swap({ tokenIn: tokenIn.address, tokenOut: tokenOut.address, fee, amountIn: amountInBigInt, amountOutMinimum, sqrtPriceLimitX96: 0n });
    } catch (error) { console.error('Swap failed:', error); }
  };

  const handleApprove = async () => {
    if (!amountIn || !tokenIn) return;
    try { await approve(amountInBigInt); }
    catch (error) { console.error('Approval failed:', error); }
  };

  const priceDisplay = useMemo(() => {
    if (!formattedAmountOut || !amountIn || Number(amountIn) === 0) return null;
    const rate = Number(formattedAmountOut) / Number(amountIn);
    return `1 ${tokenIn?.symbol} = ${rate.toFixed(4)} ${tokenOut?.symbol}`;
  }, [formattedAmountOut, amountIn, tokenIn, tokenOut]);

  const closeAllDropdowns = () => {
    setShowTokenSelectFrom(false);
    setShowTokenSelectTo(false);
    setTokenSearch('');
  };

  // Reusable token selector modal
  const TokenSelectorModal = ({ isFrom }: { isFrom: boolean }) => {
    const disabledIndex = isFrom ? selectedTokenOut : selectedTokenIn;
    const selectedIndex = isFrom ? selectedTokenIn : selectedTokenOut;

    const handleSelect = (index: number) => {
      if (index === disabledIndex) return;
      if (isFrom) {
        setSelectedTokenIn(index);
        setAmountIn('');
      } else {
        setSelectedTokenOut(index);
      }
      closeAllDropdowns();
    };

    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={closeAllDropdowns}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div
          className="relative w-full max-w-md bg-[#0c0c0e] border border-amber-500/20 rounded-3xl shadow-2xl shadow-amber-500/10 fade-in overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <h3 className="text-lg font-bold text-white">Select a token</h3>
            <button onClick={closeAllDropdowns} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Search */}
          <div className="px-5 pt-4 pb-3">
            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10 focus-within:border-amber-500/30 transition-colors">
              <Search className="w-4 h-4 text-gray-500 shrink-0" />
              <input
                type="text"
                placeholder="Search by name or paste address"
                value={tokenSearch}
                onChange={(e) => setTokenSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
                autoFocus
              />
              {tokenSearch && (
                <button onClick={() => setTokenSearch('')} className="p-0.5 rounded hover:bg-white/10 transition-colors">
                  <X className="w-3.5 h-3.5 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Popular tokens row */}
          {!tokenSearch && (
            <div className="px-5 pb-3">
              <div className="flex flex-wrap gap-2">
                {popularTokens.map((token) => {
                  const tokenIndex = chainTokens.findIndex((t) => t.symbol === token.symbol);
                  const isDisabled = tokenIndex === disabledIndex;
                  const isSelected = tokenIndex === selectedIndex;
                  return (
                    <button
                      key={token.symbol}
                      onClick={() => handleSelect(tokenIndex)}
                      disabled={isDisabled}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
                        ${isSelected
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                          : isDisabled
                            ? 'opacity-30 cursor-not-allowed border-white/5 text-gray-600'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-amber-500/10 hover:border-amber-500/20 hover:text-white'
                        }`}
                    >
                      <img src={token.logoURI} alt={token.symbol} className="w-5 h-5 rounded-full"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/tokens/default.svg'; }} />
                      {token.symbol}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="border-t border-white/5" />

          {/* Token list */}
          <div className="max-h-85 overflow-y-auto custom-scrollbar">
            {filteredTokens.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">No tokens found</div>
            ) : (
              filteredTokens.map((token) => {
                const tokenIndex = chainTokens.findIndex((t) => t.symbol === token.symbol);
                const isDisabled = tokenIndex === disabledIndex;
                const isSelected = tokenIndex === selectedIndex;
                return (
                  <button
                    key={token.symbol}
                    onClick={() => handleSelect(tokenIndex)}
                    disabled={isDisabled}
                    className={`w-full flex items-center gap-3 px-5 py-3 transition-all duration-150 
                      ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-amber-500/5 cursor-pointer'}
                      ${isSelected ? 'bg-amber-500/5' : ''}`}
                  >
                    <img src={token.logoURI} alt={token.symbol} className="w-9 h-9 rounded-full ring-1 ring-white/10"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/tokens/default.svg'; }} />
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-bold text-white text-sm">{token.symbol}</div>
                      <div className="text-xs text-gray-500 truncate">{token.name}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-80 h-80 bg-linear-to-br from-amber-500/8 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-linear-to-br from-yellow-400/6 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10 fade-in">
          <h1 className="text-4xl lg:text-5xl font-bold golden-text-gradient mb-3">Trade</h1>
          <p className="text-gray-400 text-lg">Swap tokens with optimal execution</p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="glass-effect rounded-3xl border border-amber-500/20 p-1 hover-glow transition-all duration-500 shadow-2xl shadow-amber-500/5 fade-in">
            <div className="bg-black/40 rounded-[1.35rem] p-6">

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Swap</h2>
                <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-xl hover:bg-amber-500/10 transition-all duration-200 group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-amber-400 group-hover:rotate-90 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>

              {/* Settings */}
              {showSettings && (
                <div className="mb-5 p-4 bg-black/30 rounded-xl border border-amber-500/10 fade-in">
                  <span className="text-sm font-medium text-gray-300 mb-3 block">Slippage Tolerance</span>
                  <div className="flex gap-2">
                    {[0.1, 0.5, 1.0, 3.0].map((value) => (
                      <button key={value} onClick={() => setSlippage(value)}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          slippage === value
                            ? 'golden-gradient text-black shadow-lg shadow-amber-500/20 scale-105'
                            : 'bg-white/5 text-gray-300 hover:bg-amber-500/10 hover:text-amber-300 border border-transparent hover:border-amber-500/20'
                        }`}
                      >
                        {value}%
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* FROM Token */}
              <div className="relative">
                <div className="bg-white/3 rounded-2xl p-4 border border-white/5 hover:border-amber-500/20 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 font-medium">You pay</span>
                    <span className="text-xs text-gray-600">Balance: 0.00</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="text" inputMode="decimal" placeholder="0" value={amountIn}
                      onChange={(e) => { const v = e.target.value; if (/^[0-9]*\.?[0-9]*$/.test(v)) setAmountIn(v); }}
                      className="flex-1 bg-transparent text-3xl font-bold text-white outline-none placeholder:text-gray-700 min-w-0"
                    />
                    <button onClick={() => { setShowTokenSelectFrom(true); setShowTokenSelectTo(false); }}
                      className="flex items-center gap-2.5 bg-white/5 hover:bg-amber-500/15 rounded-full pl-2 pr-4 py-2 border border-white/10 hover:border-amber-500/30 transition-all duration-200 shrink-0"
                    >
                      <img src={tokenIn?.logoURI || '/tokens/weth.svg'} alt={tokenIn?.symbol || ''} className="w-7 h-7 rounded-full"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/tokens/default.svg'; }} />
                      <span className="font-bold text-white text-sm">{tokenIn?.symbol || 'SELECT'}</span>
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Token selector modal for FROM */}
              {showTokenSelectFrom && <TokenSelectorModal isFrom={true} />}

              {/* Swap Direction */}
              <div className="flex justify-center -my-3 relative z-10">
                <button onClick={switchTokens}
                  className="w-10 h-10 rounded-xl bg-black/80 border-2 border-amber-500/20 hover:border-amber-500/50 flex items-center justify-center transition-all duration-300 hover:rotate-180 hover:scale-110 hover:bg-amber-500/10 hover:shadow-lg hover:shadow-amber-500/20"
                >
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>

              {/* TO Token */}
              <div className="relative">
                <div className="bg-white/3 rounded-2xl p-4 border border-white/5 hover:border-amber-500/20 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 font-medium">You receive</span>
                    <span className="text-xs text-gray-600">Balance: 0.00</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      {isQuoteLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                          <span className="text-gray-500 text-lg">Fetching...</span>
                        </div>
                      ) : (
                        <span className={`text-3xl font-bold ${formattedAmountOut ? 'text-white' : 'text-gray-700'}`}>
                          {formattedAmountOut || '0'}
                        </span>
                      )}
                    </div>
                    <button onClick={() => { setShowTokenSelectTo(true); setShowTokenSelectFrom(false); }}
                      className="flex items-center gap-2.5 bg-white/5 hover:bg-amber-500/15 rounded-full pl-2 pr-4 py-2 border border-white/10 hover:border-amber-500/30 transition-all duration-200 shrink-0"
                    >
                      <img src={tokenOut?.logoURI || '/tokens/usdc.svg'} alt={tokenOut?.symbol || ''} className="w-7 h-7 rounded-full"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/tokens/default.svg'; }} />
                      <span className="font-bold text-white text-sm">{tokenOut?.symbol || 'SELECT'}</span>
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Token selector modal for TO */}
              {showTokenSelectTo && <TokenSelectorModal isFrom={false} />}

              {/* Price Info */}
              {priceDisplay && (
                <div className="mt-4 px-4 py-3 bg-white/2 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Rate</span>
                    <span className="text-xs text-gray-300 font-medium">{priceDisplay}</span>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-5">
                {!isConnected ? (
                  <ConnectButton.Custom>
                    {({ openConnectModal, mounted }) => (
                      <button onClick={openConnectModal} disabled={!mounted}
                        className="w-full py-4 rounded-2xl font-bold text-lg golden-gradient text-black hover:shadow-2xl hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                      >
                        Connect Wallet
                      </button>
                    )}
                  </ConnectButton.Custom>
                ) : !amountIn || amountIn === '0' ? (
                  <button disabled className="w-full py-4 rounded-2xl font-bold text-lg bg-white/5 text-gray-600 cursor-not-allowed border border-white/5">
                    Enter an amount
                  </button>
                ) : (
                  <div className="space-y-3">
                    <button onClick={handleApprove} disabled={isApproving}
                      className="w-full py-3.5 rounded-2xl font-bold text-sm bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isApproving ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                          Approving...
                        </span>
                      ) : `Approve ${tokenIn?.symbol}`}
                    </button>
                    <button onClick={handleSwap} disabled={isSwapLoading || !quote}
                      className="w-full py-4 rounded-2xl font-bold text-lg golden-gradient text-black hover:shadow-2xl hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isSwapLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Swapping...
                        </span>
                      ) : 'Swap'}
                    </button>
                  </div>
                )}
              </div>

              {/* Success */}
              {isSuccess && (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-green-400 font-bold text-sm">Swap Successful!</div>
                      <div className="text-green-400/60 text-xs">Transaction confirmed</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quote Details */}
              {quote && amountIn && (
                <div className="mt-4 space-y-2 fade-in">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs text-gray-600">Price Impact</span>
                    <span className="text-xs text-green-400 font-medium">&lt; 0.01%</span>
                  </div>
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs text-gray-600">Min. Received</span>
                    <span className="text-xs text-gray-300 font-medium">
                      {formatUnits((quote.amountOut * BigInt(Math.floor((100 - slippage) * 100))) / 10000n, tokenOut?.decimals || 6)} {tokenOut?.symbol}
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs text-gray-600">Network Fee</span>
                    <span className="text-xs text-gray-300 font-medium">~$2.50</span>
                  </div>
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs text-gray-600">Route</span>
                    <span className="text-xs text-amber-400 font-medium">{tokenIn?.symbol} → {tokenOut?.symbol} (0.3%)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-6">
            <span className="text-xs text-gray-600">Powered by <span className="golden-text-gradient font-bold">ZoneX Protocol</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
