'use client';

import { useState } from 'react';
import { Plus, TrendingUp, Droplets, BarChart3, DollarSign, Search } from 'lucide-react';
import Link from 'next/link';

export default function PoolsPage() {
  const [sortBy, setSortBy] = useState<'tvl' | 'volume' | 'apr'>('tvl');
  const [searchQuery, setSearchQuery] = useState('');

  const pools = [
    {
      id: '1',
      token0: { symbol: 'WETH', logo: '/tokens/weth.svg' },
      token1: { symbol: 'USDC', logo: '/tokens/usdc.svg' },
      fee: '0.3%',
      tvl: '$45.2M',
      tvlRaw: 45.2,
      volume24h: '$12.8M',
      volumeRaw: 12.8,
      volume7d: '$89.4M',
      fees24h: '$38.4K',
      apr: '12.5%',
      aprRaw: 12.5,
    },
    {
      id: '2',
      token0: { symbol: 'WETH', logo: '/tokens/weth.svg' },
      token1: { symbol: 'USDC', logo: '/tokens/usdc.svg' },
      fee: '0.05%',
      tvl: '$23.1M',
      tvlRaw: 23.1,
      volume24h: '$8.2M',
      volumeRaw: 8.2,
      volume7d: '$52.6M',
      fees24h: '$4.1K',
      apr: '8.2%',
      aprRaw: 8.2,
    },
    {
      id: '3',
      token0: { symbol: 'WETH', logo: '/tokens/weth.svg' },
      token1: { symbol: 'USDT', logo: '/tokens/usdt.svg' },
      fee: '0.3%',
      tvl: '$18.7M',
      tvlRaw: 18.7,
      volume24h: '$5.9M',
      volumeRaw: 5.9,
      volume7d: '$41.3M',
      fees24h: '$17.7K',
      apr: '15.2%',
      aprRaw: 15.2,
    },
    {
      id: '4',
      token0: { symbol: 'WBTC', logo: '/tokens/wbtc.svg' },
      token1: { symbol: 'WETH', logo: '/tokens/weth.svg' },
      fee: '0.3%',
      tvl: '$12.4M',
      tvlRaw: 12.4,
      volume24h: '$3.2M',
      volumeRaw: 3.2,
      volume7d: '$22.8M',
      fees24h: '$9.6K',
      apr: '11.8%',
      aprRaw: 11.8,
    },
    {
      id: '5',
      token0: { symbol: 'DAI', logo: '/tokens/dai.svg' },
      token1: { symbol: 'USDC', logo: '/tokens/usdc.svg' },
      fee: '0.01%',
      tvl: '$9.8M',
      tvlRaw: 9.8,
      volume24h: '$2.1M',
      volumeRaw: 2.1,
      volume7d: '$14.2M',
      fees24h: '$2.1K',
      apr: '6.4%',
      aprRaw: 6.4,
    },
    {
      id: '6',
      token0: { symbol: 'LINK', logo: '/tokens/link.svg' },
      token1: { symbol: 'WETH', logo: '/tokens/weth.svg' },
      fee: '0.3%',
      tvl: '$7.3M',
      tvlRaw: 7.3,
      volume24h: '$1.8M',
      volumeRaw: 1.8,
      volume7d: '$11.6M',
      fees24h: '$5.4K',
      apr: '9.7%',
      aprRaw: 9.7,
    },
  ];

  const filteredPools = pools
    .filter((pool) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        pool.token0.symbol.toLowerCase().includes(q) ||
        pool.token1.symbol.toLowerCase().includes(q) ||
        `${pool.token0.symbol}/${pool.token1.symbol}`.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'tvl') return b.tvlRaw - a.tvlRaw;
      if (sortBy === 'volume') return b.volumeRaw - a.volumeRaw;
      if (sortBy === 'apr') return b.aprRaw - a.aprRaw;
      return 0;
    });

  const stats = [
    { label: 'Total Value Locked', value: '$124.8M', change: '+5.2%', icon: Droplets, positive: true },
    { label: '24h Volume', value: '$32.4M', change: '+12.8%', icon: BarChart3, positive: true },
    { label: '24h Fees', value: '$97.2K', change: '+8.4%', icon: DollarSign, positive: true },
    { label: 'Active Pools', value: '42', change: '+3', icon: TrendingUp, positive: true },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 fade-in">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold golden-text-gradient mb-3">Liquidity Pools</h1>
            <p className="text-gray-400 text-lg">Discover and provide liquidity to earn trading fees</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/liquidity"
              className="inline-flex items-center gap-2 golden-gradient text-black font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-5 h-5" />
              Add Liquidity
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="glass-effect golden-border rounded-2xl p-6 hover-lift hover-glow fade-in group cursor-default"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="group-hover:scale-110 transition-transform duration-300 inline-block">
                  <stat.icon className="w-7 h-7 text-amber-400" strokeWidth={1.5} />
                </span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  stat.positive ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Pool Table Card */}
        <div className="glass-effect golden-border rounded-2xl overflow-hidden fade-in hover-glow" style={{ animationDelay: '0.4s' }}>

          {/* Table Header Bar */}
          <div className="p-6 border-b border-amber-500/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">All Pools</h3>
                <p className="text-sm text-gray-500">Browse and filter available pools</p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search pools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white/5 border border-amber-500/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/30 transition-colors w-full sm:w-48"
                  />
                </div>

                {/* Sort Buttons */}
                <div className="flex gap-1.5">
                  {(['tvl', 'volume', 'apr'] as const).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSortBy(key)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 ${
                        sortBy === key
                          ? 'golden-gradient text-black shadow-lg shadow-amber-500/20'
                          : 'glass-effect text-gray-400 hover:text-amber-300 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20'
                      }`}
                    >
                      {key.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-amber-500/10 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="text-left py-4 px-6">Pool</th>
                  <th className="text-right py-4 px-6">TVL</th>
                  <th className="text-right py-4 px-6">Volume 24H</th>
                  <th className="text-right py-4 px-6">Volume 7D</th>
                  <th className="text-right py-4 px-6">Fees 24H</th>
                  <th className="text-right py-4 px-6">APR</th>
                  <th className="text-right py-4 px-6"></th>
                </tr>
              </thead>
              <tbody>
                {filteredPools.map((pool) => (
                  <tr
                    key={pool.id}
                    className="border-b border-white/5 hover:bg-amber-500/5 transition-colors group cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-full golden-gradient flex items-center justify-center text-xs font-bold text-black border-2 border-black overflow-hidden">
                            <img
                              src={pool.token0.logo}
                              alt={pool.token0.symbol}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                if ((e.target as HTMLImageElement).parentElement) {
                                  (e.target as HTMLImageElement).parentElement!.textContent = pool.token0.symbol[0];
                                }
                              }}
                            />
                          </div>
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white border-2 border-black overflow-hidden">
                            <img
                              src={pool.token1.logo}
                              alt={pool.token1.symbol}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                if ((e.target as HTMLImageElement).parentElement) {
                                  (e.target as HTMLImageElement).parentElement!.textContent = pool.token1.symbol[0];
                                }
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                            {pool.token0.symbol}/{pool.token1.symbol}
                          </div>
                          <div className="text-xs text-gray-500">{pool.fee} fee</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-4 px-6 font-medium text-gray-300 text-sm">{pool.tvl}</td>
                    <td className="text-right py-4 px-6 font-medium text-gray-300 text-sm">{pool.volume24h}</td>
                    <td className="text-right py-4 px-6 font-medium text-gray-300 text-sm">{pool.volume7d}</td>
                    <td className="text-right py-4 px-6 font-medium text-gray-300 text-sm">{pool.fees24h}</td>
                    <td className="text-right py-4 px-6">
                      <span className="font-bold text-green-400 text-sm bg-green-400/10 px-2.5 py-1 rounded-full">
                        {pool.apr}
                      </span>
                    </td>
                    <td className="text-right py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/pools/${pool.id}`}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-amber-500/20 text-amber-400 hover:bg-amber-500/10 transition-colors"
                        >
                          View
                        </Link>
                        <Link
                          href="/liquidity"
                          className="px-3 py-1.5 text-xs font-bold rounded-lg golden-gradient text-black hover:scale-105 transition-transform"
                        >
                          Add
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-white/5">
            {filteredPools.map((pool) => (
              <div key={pool.id} className="p-4 hover:bg-amber-500/5 transition-colors">
                {/* Pool name row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full golden-gradient flex items-center justify-center text-xs font-bold text-black border-2 border-black overflow-hidden">
                        <img
                          src={pool.token0.logo}
                          alt={pool.token0.symbol}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            if ((e.target as HTMLImageElement).parentElement) {
                              (e.target as HTMLImageElement).parentElement!.textContent = pool.token0.symbol[0];
                            }
                          }}
                        />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white border-2 border-black overflow-hidden">
                        <img
                          src={pool.token1.logo}
                          alt={pool.token1.symbol}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            if ((e.target as HTMLImageElement).parentElement) {
                              (e.target as HTMLImageElement).parentElement!.textContent = pool.token1.symbol[0];
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">
                        {pool.token0.symbol}/{pool.token1.symbol}
                      </div>
                      <div className="text-xs text-gray-500">{pool.fee} fee</div>
                    </div>
                  </div>
                  <span className="font-bold text-green-400 text-sm bg-green-400/10 px-2.5 py-1 rounded-full">
                    {pool.apr}
                  </span>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">TVL</div>
                    <div className="text-sm font-medium text-gray-300">{pool.tvl}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Volume 24H</div>
                    <div className="text-sm font-medium text-gray-300">{pool.volume24h}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Volume 7D</div>
                    <div className="text-sm font-medium text-gray-300">{pool.volume7d}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Fees 24H</div>
                    <div className="text-sm font-medium text-gray-300">{pool.fees24h}</div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <Link
                    href={`/pools/${pool.id}`}
                    className="flex-1 text-center px-3 py-2 text-xs font-medium rounded-lg border border-amber-500/20 text-amber-400 hover:bg-amber-500/10 transition-colors"
                  >
                    View Details
                  </Link>
                  <Link
                    href="/liquidity"
                    className="flex-1 text-center px-3 py-2 text-xs font-bold rounded-lg golden-gradient text-black hover:scale-105 transition-transform"
                  >
                    Add Liquidity
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredPools.length === 0 && (
            <div className="py-16 text-center">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg font-medium mb-1">No pools found</p>
              <p className="text-gray-500 text-sm">Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
