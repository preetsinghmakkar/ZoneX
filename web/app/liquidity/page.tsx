'use client';

import { useState, useMemo } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { COMMON_TOKENS, FEE_TIERS } from '@/lib/constants';
import {
  Plus, Minus, ChevronDown, Search, X, Check,
  Droplets, TrendingUp, Wallet, Settings,
  Maximize2, BarChart3, Lock
} from 'lucide-react';

const POPULAR_SYMBOLS = ['WETH', 'USDC', 'USDT', 'DAI', 'WBTC', 'UNI'];

type Token = {
  address: `0x${string}`;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
  isNative: boolean;
};

type FeeTier = typeof FEE_TIERS[number];

type Position = {
  id: string;
  token0: Token | null;
  token1: Token | null;
  fee: string;
  liquidity: string;
  liquidityUSD: number;
  fees0: string;
  fees1: string;
  feesUSD: string;
  minPrice: string;
  maxPrice: string;
  currentPrice: string;
  status: 'In Range' | 'Out of Range' | 'Closed';
  apr: string;
  token0Amount: string;
  token1Amount: string;
  nftId: number;
};

export default function LiquidityPage() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const chainTokens = COMMON_TOKENS[chainId as keyof typeof COMMON_TOKENS] || COMMON_TOKENS[1];

  const [token0, setToken0] = useState<Token>(chainTokens[1] as unknown as Token);
  const [token1, setToken1] = useState<Token>(chainTokens[0] as unknown as Token);
  const [feeTier, setFeeTier] = useState<FeeTier>(FEE_TIERS[1]);
  const [amount0, setAmount0] = useState('');
  const [amount1, setAmount1] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showTokenSelect, setShowTokenSelect] = useState<'token0' | 'token1' | null>(null);
  const [tokenSearch, setTokenSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'positions' | 'add'>('positions');
  const [showFullRange, setShowFullRange] = useState(false);
  const [expandedPosition, setExpandedPosition] = useState<string | null>(null);

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

  const positions: Position[] = useMemo(() => [
    {
      id: '1',
      token0: chainTokens.find(t => t.symbol === 'USDC') as unknown as Token || null,
      token1: chainTokens.find(t => t.symbol === 'WETH') as unknown as Token || null,
      fee: '0.3%',
      liquidity: '12,450.30',
      liquidityUSD: 12450.30,
      fees0: '12.45 USDC',
      fees1: '0.0052 WETH',
      feesUSD: '$23.45',
      minPrice: '1,800',
      maxPrice: '2,200',
      currentPrice: '2,024.35',
      status: 'In Range',
      apr: '24.8%',
      token0Amount: '6,225.15',
      token1Amount: '3.08',
      nftId: 42069,
    },
    {
      id: '2',
      token0: chainTokens.find(t => t.symbol === 'USDC') as unknown as Token || null,
      token1: chainTokens.find(t => t.symbol === 'WETH') as unknown as Token || null,
      fee: '0.05%',
      liquidity: '8,230.15',
      liquidityUSD: 8230.15,
      fees0: '4.12 USDC',
      fees1: '0.0018 WETH',
      feesUSD: '$7.80',
      minPrice: '1,900',
      maxPrice: '2,100',
      currentPrice: '2,024.35',
      status: 'Out of Range',
      apr: '18.2%',
      token0Amount: '8,230.15',
      token1Amount: '0.00',
      nftId: 42070,
    },
    {
      id: '3',
      token0: chainTokens.find(t => t.symbol === 'DAI') as unknown as Token || null,
      token1: chainTokens.find(t => t.symbol === 'USDC') as unknown as Token || null,
      fee: '0.05%',
      liquidity: '25,000.00',
      liquidityUSD: 25000.00,
      fees0: '8.20 DAI',
      fees1: '7.95 USDC',
      feesUSD: '$16.15',
      minPrice: '0.998',
      maxPrice: '1.002',
      currentPrice: '1.0001',
      status: 'In Range',
      apr: '4.2%',
      token0Amount: '12,500.00',
      token1Amount: '12,500.00',
      nftId: 42071,
    },
  ], [chainTokens]);

  const totalLiquidity = positions.reduce((s, p) => s + p.liquidityUSD, 0);
  const totalFees = positions.reduce((s, p) => s + parseFloat(p.feesUSD.replace('$', '')), 0);
  const inRangeCount = positions.filter(p => p.status === 'In Range').length;

  const handleTokenSelect = (tokenIndex: number) => {
    const selected = chainTokens[tokenIndex] as unknown as Token;
    if (showTokenSelect === 'token0') {
      if (selected.symbol === token1?.symbol) setToken1(token0);
      setToken0(selected);
    } else {
      if (selected.symbol === token0?.symbol) setToken0(token1);
      setToken1(selected);
    }
    setShowTokenSelect(null);
    setTokenSearch('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Range': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400', border: 'border-emerald-500/20' };
      case 'Out of Range': return { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400', border: 'border-amber-500/20' };
      default: return { bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'bg-gray-400', border: 'border-gray-500/20' };
    }
  };

  const PriceRangeBar = ({ min, max, current }: { min: string; max: string; current: string }) => {
    const minN = parseFloat(min.replace(/,/g, ''));
    const maxN = parseFloat(max.replace(/,/g, ''));
    const curN = parseFloat(current.replace(/,/g, ''));
    const range = maxN - minN;
    const pos = range > 0 ? Math.min(100, Math.max(0, ((curN - minN) / range) * 100)) : 50;
    const inRange = curN >= minN && curN <= maxN;

    return (
      <div className="space-y-2">
        <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
          <div className="absolute inset-y-0 left-0 right-0 bg-linear-to-r from-amber-500/30 via-amber-400/50 to-amber-500/30 rounded-full" />
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 shadow-lg transition-all ${
              inRange ? 'bg-emerald-400 border-emerald-300 shadow-emerald-500/30' : 'bg-amber-400 border-amber-300 shadow-amber-500/30'
            }`}
            style={{ left: `calc(${pos}% - 6px)` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>${min}</span>
          <span className={inRange ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>${current}</span>
          <span>${max}</span>
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-linear-to-br from-amber-500/3 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 fade-in">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold golden-text-gradient mb-2">Liquidity</h1>
            <p className="text-gray-400 text-lg">Provide concentrated liquidity and earn fees on every swap</p>
          </div>
          <button
            onClick={() => setActiveTab('add')}
            className="flex items-center gap-2 px-6 py-3 golden-gradient rounded-2xl font-bold text-black hover:shadow-2xl hover:shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all duration-200 self-start md:self-auto"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
            New Position
          </button>
        </div>

        {/* Stats Overview */}
        {isConnected && positions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="glass-effect golden-border rounded-2xl p-5 hover-lift">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-sm text-gray-400">Total Liquidity</span>
              </div>
              <div className="text-2xl font-bold text-white">${totalLiquidity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="glass-effect golden-border rounded-2xl p-5 hover-lift">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-sm text-gray-400">Uncollected Fees</span>
              </div>
              <div className="text-2xl font-bold text-white">${totalFees.toFixed(2)}</div>
            </div>
            <div className="glass-effect golden-border rounded-2xl p-5 hover-lift">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-sm text-gray-400">Active Positions</span>
              </div>
              <div className="text-2xl font-bold text-white">{inRangeCount}<span className="text-gray-500 text-lg">/{positions.length}</span></div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 glass-effect rounded-2xl mb-8 w-fit fade-in" style={{ animationDelay: '0.15s' }}>
          <button
            onClick={() => setActiveTab('positions')}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              activeTab === 'positions'
                ? 'golden-gradient text-black shadow-lg shadow-amber-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Your Positions
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              activeTab === 'add'
                ? 'golden-gradient text-black shadow-lg shadow-amber-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Add Liquidity
          </button>
        </div>

        {/* ========== POSITIONS TAB ========== */}
        {activeTab === 'positions' && (
          <div className="space-y-4 fade-in">
            {!isConnected ? (
              <div className="glass-effect golden-border rounded-3xl p-16 text-center">
                <Lock className="w-12 h-12 text-amber-400/40 mx-auto mb-4" strokeWidth={1.5} />
                <h3 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">Connect your wallet to view and manage your liquidity positions</p>
                <ConnectButton.Custom>
                  {({ openConnectModal, mounted }) => (
                    <button onClick={openConnectModal} disabled={!mounted}
                      className="px-8 py-3 golden-gradient rounded-2xl font-bold text-black hover:shadow-2xl hover:shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                      Connect Wallet
                    </button>
                  )}
                </ConnectButton.Custom>
              </div>
            ) : positions.length === 0 ? (
              <div className="glass-effect golden-border rounded-3xl p-16 text-center">
                <Droplets className="w-12 h-12 text-amber-400/40 mx-auto mb-4" strokeWidth={1.5} />
                <h3 className="text-xl font-bold text-white mb-2">No Positions Found</h3>
                <p className="text-gray-400 mb-6">Open a new liquidity position to start earning fees</p>
                <button onClick={() => setActiveTab('add')}
                  className="px-8 py-3 golden-gradient rounded-2xl font-bold text-black hover:shadow-2xl hover:shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  New Position
                </button>
              </div>
            ) : (
              positions.map((position, index) => {
                const statusColors = getStatusColor(position.status);
                const isExpanded = expandedPosition === position.id;
                return (
                  <div
                    key={position.id}
                    className="glass-effect golden-border rounded-2xl overflow-hidden hover-lift fade-in transition-all duration-300"
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    {/* Position Header */}
                    <button
                      onClick={() => setExpandedPosition(isExpanded ? null : position.id)}
                      className="w-full p-5 flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={position.token0?.logoURI || '/tokens/default.svg'} alt={position.token0?.symbol || ''}
                            className="w-10 h-10 rounded-full ring-2 ring-black/50"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/tokens/default.svg'; }} />
                          <img src={position.token1?.logoURI || '/tokens/default.svg'} alt={position.token1?.symbol || ''}
                            className="w-10 h-10 rounded-full ring-2 ring-black/50 absolute -right-3 top-0"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/tokens/default.svg'; }} />
                        </div>
                        <div className="ml-2">
                          <div className="flex items-center gap-2.5">
                            <span className="font-bold text-white text-lg group-hover:text-yellow-100 transition-colors">
                              {position.token0?.symbol}/{position.token1?.symbol}
                            </span>
                            <span className="px-2 py-0.5 rounded-lg bg-white/5 text-xs font-medium text-gray-400 border border-white/5">
                              {position.fee}
                            </span>
                            <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors.bg} ${statusColors.text} ${statusColors.border} border`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusColors.dot} ${position.status === 'In Range' ? 'animate-pulse' : ''}`} />
                              {position.status}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 mt-0.5 block">NFT #{position.nftId}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <div className="text-lg font-bold text-white">${position.liquidity}</div>
                          <div className="text-xs text-gray-500">Liquidity</div>
                        </div>
                        <div className="text-right hidden sm:block">
                          <div className="text-lg font-bold text-emerald-400">{position.feesUSD}</div>
                          <div className="text-xs text-gray-500">Uncollected</div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-amber-500/10 fade-in">
                        <div className="px-5 pt-5 pb-3">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-300">Price Range</span>
                            <span className="text-xs text-gray-500">
                              Current: <span className="text-white font-medium">${position.currentPrice}</span> {position.token0?.symbol} per {position.token1?.symbol}
                            </span>
                          </div>
                          <PriceRangeBar min={position.minPrice} max={position.maxPrice} current={position.currentPrice} />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-amber-500/5 mx-5 rounded-2xl overflow-hidden mb-5">
                          <div className="bg-black/60 p-4">
                            <div className="text-xs text-gray-500 mb-1">{position.token0?.symbol} Deposited</div>
                            <div className="font-bold text-white text-sm">{position.token0Amount}</div>
                          </div>
                          <div className="bg-black/60 p-4">
                            <div className="text-xs text-gray-500 mb-1">{position.token1?.symbol} Deposited</div>
                            <div className="font-bold text-white text-sm">{position.token1Amount}</div>
                          </div>
                          <div className="bg-black/60 p-4">
                            <div className="text-xs text-gray-500 mb-1">Fee Earnings</div>
                            <div className="font-bold text-emerald-400 text-sm">{position.feesUSD}</div>
                          </div>
                          <div className="bg-black/60 p-4">
                            <div className="text-xs text-gray-500 mb-1">APR</div>
                            <div className="font-bold text-amber-400 text-sm">{position.apr}</div>
                          </div>
                        </div>

                        <div className="px-5 pb-5">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-300">Uncollected Fees</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-white/3 rounded-xl p-3 flex items-center gap-3">
                              <img src={position.token0?.logoURI || '/tokens/default.svg'} alt="" className="w-6 h-6 rounded-full"
                                onError={(e) => { (e.target as HTMLImageElement).src = '/tokens/default.svg'; }} />
                              <span className="text-white text-sm font-medium">{position.fees0}</span>
                            </div>
                            <div className="bg-white/3 rounded-xl p-3 flex items-center gap-3">
                              <img src={position.token1?.logoURI || '/tokens/default.svg'} alt="" className="w-6 h-6 rounded-full"
                                onError={(e) => { (e.target as HTMLImageElement).src = '/tokens/default.svg'; }} />
                              <span className="text-white text-sm font-medium">{position.fees1}</span>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button className="flex-1 py-3 rounded-2xl font-bold text-sm golden-gradient text-black hover:shadow-xl hover:shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                              Collect Fees
                            </button>
                            <button className="flex-1 py-3 rounded-2xl font-bold text-sm bg-white/5 text-white border border-white/10 hover:bg-amber-500/10 hover:border-amber-500/20 hover:text-amber-200 transition-all duration-200">
                              Increase Liquidity
                            </button>
                            <button className="py-3 px-5 rounded-2xl font-bold text-sm bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200">
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ========== ADD LIQUIDITY TAB ========== */}
        {activeTab === 'add' && (
          <div className="max-w-2xl mx-auto fade-in">
            <div className="glass-effect rounded-3xl border border-amber-500/20 p-1 hover-glow transition-all duration-500 shadow-2xl shadow-amber-500/5">
              <div className="bg-black/40 rounded-[1.35rem] p-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setActiveTab('positions')} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h2 className="text-lg font-bold text-white">Add Liquidity</h2>
                  </div>
                  <button className="p-2 rounded-xl hover:bg-amber-500/10 transition-all duration-200 group">
                    <Settings className="w-5 h-5 text-gray-400 group-hover:text-amber-400 group-hover:rotate-90 transition-all duration-300" />
                  </button>
                </div>

                {/* Step 1: Token Pair */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full golden-gradient flex items-center justify-center text-xs font-bold text-black">1</div>
                    <span className="text-sm font-semibold text-white">Select Pair</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setShowTokenSelect('token0')}
                      className="flex items-center gap-3 bg-white/3 rounded-2xl p-4 border border-white/5 hover:border-amber-500/20 transition-all duration-200 group"
                    >
                      <img src={token0?.logoURI || '/tokens/default.svg'} alt={token0?.symbol || ''} className="w-8 h-8 rounded-full"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/tokens/default.svg'; }} />
                      <div className="text-left flex-1">
                        <div className="font-bold text-white text-sm group-hover:text-yellow-100 transition-colors">{token0?.symbol || 'Select'}</div>
                        <div className="text-xs text-gray-500 truncate">{token0?.name || 'Choose token'}</div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => setShowTokenSelect('token1')}
                      className="flex items-center gap-3 bg-white/3 rounded-2xl p-4 border border-white/5 hover:border-amber-500/20 transition-all duration-200 group"
                    >
                      <img src={token1?.logoURI || '/tokens/default.svg'} alt={token1?.symbol || ''} className="w-8 h-8 rounded-full"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/tokens/default.svg'; }} />
                      <div className="text-left flex-1">
                        <div className="font-bold text-white text-sm group-hover:text-yellow-100 transition-colors">{token1?.symbol || 'Select'}</div>
                        <div className="text-xs text-gray-500 truncate">{token1?.name || 'Choose token'}</div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Step 2: Fee Tier */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full golden-gradient flex items-center justify-center text-xs font-bold text-black">2</div>
                    <span className="text-sm font-semibold text-white">Fee Tier</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {FEE_TIERS.map((tier) => (
                      <button
                        key={tier.fee}
                        onClick={() => setFeeTier(tier)}
                        className={`relative rounded-2xl p-3.5 border text-center transition-all duration-200 ${
                          feeTier.fee === tier.fee
                            ? 'bg-amber-500/10 border-amber-500/30 shadow-lg shadow-amber-500/10'
                            : 'bg-white/3 border-white/5 hover:bg-white/5 hover:border-white/10'
                        }`}
                      >
                        {feeTier.fee === tier.fee && (
                          <div className="absolute top-2 right-2">
                            <Check className="w-3.5 h-3.5 text-amber-400" />
                          </div>
                        )}
                        <div className={`text-lg font-bold mb-0.5 ${feeTier.fee === tier.fee ? 'text-amber-300' : 'text-white'}`}>
                          {tier.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {tier.fee === 500 ? 'Best for stables' : tier.fee === 3000 ? 'Most pairs' : 'Volatile pairs'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Price Range */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full golden-gradient flex items-center justify-center text-xs font-bold text-black">3</div>
                      <span className="text-sm font-semibold text-white">Set Price Range</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowFullRange(!showFullRange);
                        if (!showFullRange) { setMinPrice('0'); setMaxPrice('∞'); }
                        else { setMinPrice(''); setMaxPrice(''); }
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                        showFullRange
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300 border border-white/5'
                      }`}
                    >
                      <Maximize2 className="w-3 h-3" />
                      Full Range
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/3 rounded-2xl p-4 border border-white/5 hover:border-amber-500/10 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">Min Price</span>
                        <button className="text-gray-600 hover:text-gray-400 transition-colors">
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        disabled={showFullRange}
                        className="w-full bg-transparent text-2xl font-bold text-white outline-none placeholder:text-gray-700 mb-1 disabled:text-gray-600"
                      />
                      <span className="text-xs text-gray-500">{token0?.symbol} per {token1?.symbol}</span>
                    </div>
                    <div className="bg-white/3 rounded-2xl p-4 border border-white/5 hover:border-amber-500/10 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">Max Price</span>
                        <button className="text-gray-600 hover:text-gray-400 transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="∞"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        disabled={showFullRange}
                        className="w-full bg-transparent text-2xl font-bold text-white outline-none placeholder:text-gray-700 mb-1 disabled:text-gray-600"
                      />
                      <span className="text-xs text-gray-500">{token0?.symbol} per {token1?.symbol}</span>
                    </div>
                  </div>
                </div>

                {/* Step 4: Deposit Amounts */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full golden-gradient flex items-center justify-center text-xs font-bold text-black">4</div>
                    <span className="text-sm font-semibold text-white">Deposit Amounts</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white/3 rounded-2xl p-4 border border-white/5 hover:border-amber-500/20 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">{token0?.symbol || 'Token A'}</span>
                        <span className="text-xs text-gray-600">Balance: 0.00</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder="0"
                          value={amount0}
                          onChange={(e) => { const v = e.target.value; if (/^[0-9]*\.?[0-9]*$/.test(v)) setAmount0(v); }}
                          className="flex-1 bg-transparent text-2xl font-bold text-white outline-none placeholder:text-gray-700 min-w-0"
                        />
                        <div className="flex items-center gap-2 bg-white/5 rounded-full pl-2 pr-3 py-1.5 shrink-0">
                          <img src={token0?.logoURI || '/tokens/default.svg'} alt="" className="w-6 h-6 rounded-full"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/tokens/default.svg'; }} />
                          <span className="font-bold text-white text-sm">{token0?.symbol}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/3 rounded-2xl p-4 border border-white/5 hover:border-amber-500/20 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">{token1?.symbol || 'Token B'}</span>
                        <span className="text-xs text-gray-600">Balance: 0.00</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder="0"
                          value={amount1}
                          onChange={(e) => { const v = e.target.value; if (/^[0-9]*\.?[0-9]*$/.test(v)) setAmount1(v); }}
                          className="flex-1 bg-transparent text-2xl font-bold text-white outline-none placeholder:text-gray-700 min-w-0"
                        />
                        <div className="flex items-center gap-2 bg-white/5 rounded-full pl-2 pr-3 py-1.5 shrink-0">
                          <img src={token1?.logoURI || '/tokens/default.svg'} alt="" className="w-6 h-6 rounded-full"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/tokens/default.svg'; }} />
                          <span className="font-bold text-white text-sm">{token1?.symbol}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div>
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
                  ) : !amount0 && !amount1 ? (
                    <button disabled className="w-full py-4 rounded-2xl font-bold text-lg bg-white/5 text-gray-600 cursor-not-allowed border border-white/5">
                      Enter amounts
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <button className="w-full py-3.5 rounded-2xl font-bold text-sm bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200">
                        Approve {token0?.symbol}
                      </button>
                      <button className="w-full py-3.5 rounded-2xl font-bold text-sm bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200">
                        Approve {token1?.symbol}
                      </button>
                      <button className="w-full py-4 rounded-2xl font-bold text-lg golden-gradient text-black hover:shadow-2xl hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                        Add Liquidity
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <span className="text-xs text-gray-600">Powered by <span className="golden-text-gradient font-bold">ZoneX Protocol</span></span>
            </div>
          </div>
        )}
      </div>

      {/* ========== TOKEN SELECTOR MODAL ========== */}
      {showTokenSelect && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={() => { setShowTokenSelect(null); setTokenSearch(''); }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md bg-[#0c0c0e] border border-amber-500/20 rounded-3xl shadow-2xl shadow-amber-500/10 fade-in overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">Select a token</h3>
              <button onClick={() => { setShowTokenSelect(null); setTokenSearch(''); }} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

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

            {!tokenSearch && (
              <div className="px-5 pb-3">
                <div className="flex flex-wrap gap-2">
                  {popularTokens.map((token) => {
                    const tokenIndex = chainTokens.findIndex((t) => t.symbol === token.symbol);
                    return (
                      <button
                        key={token.symbol}
                        onClick={() => handleTokenSelect(tokenIndex)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border bg-white/5 border-white/10 text-gray-300 hover:bg-amber-500/10 hover:border-amber-500/20 hover:text-white transition-all duration-200"
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

            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {filteredTokens.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">No tokens found</div>
              ) : (
                filteredTokens.map((token) => {
                  const tokenIndex = chainTokens.findIndex((t) => t.symbol === token.symbol);
                  const isSelected = (showTokenSelect === 'token0' && token.symbol === token0?.symbol) ||
                                     (showTokenSelect === 'token1' && token.symbol === token1?.symbol);
                  return (
                    <button
                      key={token.symbol}
                      onClick={() => handleTokenSelect(tokenIndex)}
                      className={`w-full flex items-center gap-3 px-5 py-3 transition-all duration-150 hover:bg-amber-500/5 cursor-pointer ${isSelected ? 'bg-amber-500/5' : ''}`}
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
      )}
    </div>
  );
}
