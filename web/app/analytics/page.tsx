'use client';

import { useState, useMemo } from 'react';
import { Landmark, BarChart3, Coins, Waves } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

// Generate realistic mock data
function generateTVLData() {
  const data = [];
  let tvl = 95;
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    tvl += (Math.random() - 0.4) * 5;
    tvl = Math.max(60, Math.min(140, tvl));
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      tvl: parseFloat(tvl.toFixed(1)),
    });
  }
  return data;
}

function generateVolumeData() {
  const data = [];
  for (let i = 14; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      volume: parseFloat((Math.random() * 30 + 15).toFixed(1)),
      fees: parseFloat((Math.random() * 0.8 + 0.2).toFixed(2)),
    });
  }
  return data;
}

const GOLD_COLORS = ['#F59E0B', '#D97706', '#B45309', '#92400E', '#78350F'];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | 'ALL'>('30D');

  const tvlData = useMemo(() => generateTVLData(), []);
  const volumeData = useMemo(() => generateVolumeData(), []);

  const protocolMetrics = [
    { label: 'Total Value Locked', value: '$124.8M', change: '+5.2%', icon: Landmark, positive: true },
    { label: '24h Volume', value: '$32.4M', change: '+12.8%', icon: BarChart3, positive: true },
    { label: '24h Fees', value: '$97.2K', change: '+8.4%', icon: Coins, positive: true },
    { label: 'Active Pools', value: '42', change: '+3', icon: Waves, positive: true },
  ];

  const topTokens = [
    { symbol: 'WETH', name: 'Wrapped Ether', logo: '/tokens/weth.svg', tvl: '$52.3M', volume: '$18.2M', price: '$2,024.35', change: '+2.4%', positive: true },
    { symbol: 'USDC', name: 'USD Coin', logo: '/tokens/usdc.svg', tvl: '$48.1M', volume: '$15.8M', price: '$1.00', change: '+0.01%', positive: true },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', logo: '/tokens/wbtc.svg', tvl: '$14.2M', volume: '$4.1M', price: '$43,521.80', change: '+1.8%', positive: true },
    { symbol: 'USDT', name: 'Tether', logo: '/tokens/usdt.svg', tvl: '$10.2M', volume: '$2.9M', price: '$1.00', change: '-0.02%', positive: false },
  ];

  const topPools = [
    { pair: 'WETH/USDC', fee: '0.3%', tvl: '$45.2M', volume: '$12.8M', fees: '$38.4K', apr: '12.5%' },
    { pair: 'WETH/USDC', fee: '0.05%', tvl: '$23.1M', volume: '$8.2M', fees: '$4.1K', apr: '8.2%' },
    { pair: 'WETH/USDT', fee: '0.3%', tvl: '$18.7M', volume: '$5.9M', fees: '$17.7K', apr: '15.2%' },
    { pair: 'WBTC/WETH', fee: '0.3%', tvl: '$12.4M', volume: '$3.2M', fees: '$9.6K', apr: '11.8%' },
  ];

  const distributionData = [
    { name: 'WETH/USDC', value: 45.2 },
    { name: 'WETH/USDT', value: 23.1 },
    { name: 'WBTC/WETH', value: 18.7 },
    { name: 'UNI/WETH', value: 12.4 },
    { name: 'Others', value: 25.4 },
  ];

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-xl border border-amber-500/20 rounded-xl p-3 shadow-xl">
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} className="text-sm font-bold text-amber-400">
              {p.name === 'tvl' ? 'TVL' : p.name === 'volume' ? 'Volume' : 'Fees'}: ${p.value}M
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 fade-in">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold golden-text-gradient mb-3">Analytics</h1>
            <p className="text-gray-400 text-lg">Real-time protocol metrics and market insights</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            {(['7D', '30D', '90D', 'ALL'] as const).map((range) => (
              <button key={range} onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 ${
                  timeRange === range
                    ? 'golden-gradient text-black shadow-lg shadow-amber-500/20'
                    : 'glass-effect text-gray-400 hover:text-amber-300 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {protocolMetrics.map((metric, index) => (
            <div key={metric.label}
              className="glass-effect golden-border rounded-2xl p-6 hover-lift hover-glow fade-in group cursor-default"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="group-hover:scale-110 transition-transform duration-300 inline-block">
                  <metric.icon className="w-7 h-7 text-amber-400" strokeWidth={1.5} />
                </span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  metric.positive ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
                }`}>
                  {metric.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-sm text-gray-400">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-10">

          {/* TVL Chart */}
          <div className="lg:col-span-2 glass-effect golden-border rounded-2xl p-6 fade-in hover-glow" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Total Value Locked</h3>
                <p className="text-sm text-gray-500">Across all pools</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold golden-text-gradient">$124.8M</div>
                <div className="text-xs text-green-400 font-medium">+5.2% this week</div>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tvlData}>
                  <defs>
                    <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,158,11,0.08)" />
                  <XAxis dataKey="date" stroke="#555" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#555" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${v}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="tvl" stroke="#F59E0B" strokeWidth={2} fill="url(#tvlGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribution Pie */}
          <div className="glass-effect golden-border rounded-2xl p-6 fade-in hover-glow" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-lg font-bold text-white mb-2">TVL Distribution</h3>
            <p className="text-sm text-gray-500 mb-4">By pool</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={distributionData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                    paddingAngle={3} dataKey="value" stroke="none"
                  >
                    {distributionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={GOLD_COLORS[index % GOLD_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`$${value}M`, 'TVL']}
                    contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#F59E0B' }} labelStyle={{ color: '#9ca3af' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {distributionData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: GOLD_COLORS[index] }} />
                    <span className="text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-gray-400 font-medium">${item.value}M</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Volume Chart */}
        <div className="glass-effect golden-border rounded-2xl p-6 mb-10 fade-in hover-glow" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Trading Volume</h3>
              <p className="text-sm text-gray-500">Daily trading volume and fees</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold golden-text-gradient">$32.4M</div>
              <div className="text-xs text-green-400 font-medium">24h volume</div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#D97706" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,158,11,0.08)" />
                <XAxis dataKey="date" stroke="#555" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis stroke="#555" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${v}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="volume" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Tokens */}
        <div className="glass-effect golden-border rounded-2xl overflow-hidden mb-10 fade-in hover-glow" style={{ animationDelay: '0.6s' }}>
          <div className="p-6 border-b border-amber-500/10">
            <h3 className="text-lg font-bold text-white">Top Tokens</h3>
            <p className="text-sm text-gray-500">Most traded tokens by volume</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-amber-500/10 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="text-left py-4 px-6">Token</th>
                  <th className="text-right py-4 px-6">Price</th>
                  <th className="text-right py-4 px-6">24h Change</th>
                  <th className="text-right py-4 px-6">TVL</th>
                  <th className="text-right py-4 px-6">Volume 24H</th>
                </tr>
              </thead>
              <tbody>
                {topTokens.map((token) => (
                  <tr key={token.symbol} className="border-b border-white/5 hover:bg-amber-500/5 transition-colors group cursor-pointer">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img src={token.logo} alt={token.symbol} className="w-8 h-8 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        <div>
                          <div className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">{token.symbol}</div>
                          <div className="text-xs text-gray-500">{token.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-4 px-6 font-medium text-white text-sm">{token.price}</td>
                    <td className={`text-right py-4 px-6 font-bold text-sm ${token.positive ? 'text-green-400' : 'text-red-400'}`}>{token.change}</td>
                    <td className="text-right py-4 px-6 font-medium text-gray-300 text-sm">{token.tvl}</td>
                    <td className="text-right py-4 px-6 font-medium text-gray-300 text-sm">{token.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Pools */}
        <div className="glass-effect golden-border rounded-2xl overflow-hidden fade-in hover-glow" style={{ animationDelay: '0.7s' }}>
          <div className="p-6 border-b border-amber-500/10">
            <h3 className="text-lg font-bold text-white">Top Pools</h3>
            <p className="text-sm text-gray-500">Highest volume trading pools</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-amber-500/10 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="text-left py-4 px-6">Pool</th>
                  <th className="text-right py-4 px-6">TVL</th>
                  <th className="text-right py-4 px-6">Volume 24H</th>
                  <th className="text-right py-4 px-6">Fees 24H</th>
                  <th className="text-right py-4 px-6">APR</th>
                </tr>
              </thead>
              <tbody>
                {topPools.map((pool, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-amber-500/5 transition-colors group cursor-pointer">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          <div className="w-7 h-7 rounded-full golden-gradient flex items-center justify-center text-xs font-bold text-black border-2 border-black">
                            {pool.pair.split('/')[0][0]}
                          </div>
                          <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white border-2 border-black">
                            {pool.pair.split('/')[1][0]}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">{pool.pair}</div>
                          <div className="text-xs text-gray-500">{pool.fee} fee</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-4 px-6 font-medium text-gray-300 text-sm">{pool.tvl}</td>
                    <td className="text-right py-4 px-6 font-medium text-gray-300 text-sm">{pool.volume}</td>
                    <td className="text-right py-4 px-6 font-medium text-gray-300 text-sm">{pool.fees}</td>
                    <td className="text-right py-4 px-6">
                      <span className="font-bold text-green-400 text-sm bg-green-400/10 px-2.5 py-1 rounded-full">{pool.apr}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
