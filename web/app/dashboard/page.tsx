'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  Wallet, BarChart3, TrendingUp, Trophy, Zap,
  Droplets, Waves, PieChart, ClipboardList, Link2,
  Lock, ArrowLeftRight, Plus, Coins
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { address, isConnected } = useAccount();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Mock portfolio data
  const portfolioStats = [
    { 
      label: 'Portfolio Value', 
      value: isConnected ? '$12,450.00' : '--',
      icon: Wallet,
      change: '+5.2%',
      color: 'from-yellow-500/20 to-amber-500/10' 
    },
    { 
      label: 'Total Trades', 
      value: isConnected ? '48' : '--',
      icon: BarChart3,
      change: '+12 this week',
      color: 'from-blue-500/20 to-cyan-500/10' 
    },
    { 
      label: 'Active Positions', 
      value: isConnected ? '3' : '--',
      icon: TrendingUp,
      change: '2 in range',
      color: 'from-green-500/20 to-emerald-500/10' 
    },
    { 
      label: 'Fees Earned', 
      value: isConnected ? '$342.18' : '--',
      icon: Trophy,
      change: '+$28.50 today',
      color: 'from-purple-500/20 to-pink-500/10' 
    },
  ];

  const recentActivity = [
    { type: 'Swap', detail: '0.5 ETH → 1,012.50 USDC', time: '2 min ago', status: 'success' },
    { type: 'Add Liquidity', detail: 'WETH/USDC 0.3% Pool', time: '1 hour ago', status: 'success' },
    { type: 'Swap', detail: '500 USDC → 0.247 ETH', time: '3 hours ago', status: 'success' },
    { type: 'Collect Fees', detail: '+$18.42 from WETH/USDC', time: '1 day ago', status: 'success' },
    { type: 'Swap', detail: '1.2 ETH → 2,430 USDC', time: '2 days ago', status: 'success' },
  ];

  const quickActions = [
    { 
      title: 'Swap Tokens', 
      description: 'Exchange tokens with best execution',
      href: '/trade',
      icon: Zap,
      gradient: 'from-amber-500 to-yellow-600'
    },
    { 
      title: 'Add Liquidity', 
      description: 'Provide liquidity and earn fees',
      href: '/liquidity',
      icon: Droplets,
      gradient: 'from-blue-500 to-cyan-600'
    },
    { 
      title: 'View Pools', 
      description: 'Browse available trading pools',
      href: '/pools',
      icon: Waves,
      gradient: 'from-green-500 to-emerald-600'
    },
    { 
      title: 'Analytics', 
      description: 'Track protocol metrics & data',
      href: '/analytics',
      icon: PieChart,
      gradient: 'from-purple-500 to-pink-600'
    },
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 fade-in">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              {greeting},{' '}
              <span className="golden-text-gradient">
                {user?.firstName || user?.username || 'Trader'}
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Here&apos;s your trading overview
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {/* Profile managed by header dropdown */}
          </div>
        </div>

        {/* Wallet Connection Banner */}
        {!isConnected && (
          <div className="mb-8 glass-effect golden-border rounded-2xl p-6 fade-in">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 golden-gradient rounded-full flex items-center justify-center">
                  <Link2 className="w-6 h-6 text-black" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Connect Your Wallet</h3>
                  <p className="text-gray-400 text-sm">Link your wallet to see your portfolio and start trading</p>
                </div>
              </div>
              <ConnectButton.Custom>
                {({ openConnectModal, mounted }) => (
                  <button
                    onClick={openConnectModal}
                    disabled={!mounted}
                    className="golden-gradient hover-glow px-6 py-3 rounded-xl text-black font-bold text-sm transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Connect Wallet
                  </button>
                )}
              </ConnectButton.Custom>
            </div>
          </div>
        )}

        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {portfolioStats.map((stat, index) => (
            <div 
              key={stat.label}
              className="glass-effect golden-border rounded-2xl p-6 hover-lift hover-glow fade-in group cursor-default"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-5 h-5 text-amber-400" strokeWidth={2} />
                </div>
                <span className="text-xs text-green-400 font-semibold bg-green-400/10 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-white mb-1 group-hover:text-yellow-50 transition-colors">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions + Recent Activity */}
        <div className="grid lg:grid-cols-5 gap-8 mb-10">
          
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <span className="golden-text-gradient">Quick Actions</span>
              <Zap className="w-5 h-5 text-amber-500" strokeWidth={2} />
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link 
                  key={action.title}
                  href={action.href}
                  className="glass-effect golden-border rounded-xl p-5 hover-lift hover-glow fade-in group block"
                  style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
                >
                  <div className="mb-3 group-hover:scale-125 transition-transform duration-300">
                    <action.icon className="w-8 h-8 text-amber-400" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1 group-hover:text-yellow-100 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {action.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <span className="golden-text-gradient">Recent Activity</span>
              <ClipboardList className="w-5 h-5 text-amber-500" strokeWidth={2} />
            </h2>
            <div className="glass-effect golden-border rounded-2xl overflow-hidden fade-in" style={{ animationDelay: '0.3s' }}>
              {!isConnected ? (
                <div className="p-10 text-center">
                  <Lock className="w-10 h-10 text-amber-400/50 mx-auto mb-4" strokeWidth={1.5} />
                  <p className="text-gray-400">Connect your wallet to view activity</p>
                </div>
              ) : (
                <div className="divide-y divide-amber-500/10">
                  {recentActivity.map((activity, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 hover:bg-amber-500/5 transition-colors group cursor-default"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
                          ${activity.type === 'Swap' ? 'bg-amber-500/15 text-amber-400' : 
                            activity.type === 'Add Liquidity' ? 'bg-blue-500/15 text-blue-400' :
                            'bg-green-500/15 text-green-400'}`}
                        >
                          {activity.type === 'Swap' ? <ArrowLeftRight className="w-4 h-4" /> : activity.type === 'Add Liquidity' ? <Plus className="w-4 h-4" /> : <Coins className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white group-hover:text-yellow-100 transition-colors">
                            {activity.type}
                          </div>
                          <div className="text-xs text-gray-500">{activity.detail}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">{activity.time}</div>
                        <div className="text-xs text-green-400 font-medium">✓ {activity.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Market Overview Bar */}
        <div className="glass-effect golden-border rounded-2xl p-6 fade-in" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-lg font-bold text-white mb-4 golden-text-gradient">Market Pulse</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { token: 'ETH', price: '$2,024.35', change: '+2.4%', positive: true },
              { token: 'BTC', price: '$43,521.80', change: '+1.8%', positive: true },
              { token: 'UNI', price: '$7.24', change: '-0.6%', positive: false },
              { token: 'USDC', price: '$1.00', change: '+0.01%', positive: true },
            ].map((item) => (
              <div key={item.token} className="flex items-center gap-3">
                <img 
                  src={`/tokens/${item.token.toLowerCase() === 'btc' ? 'wbtc' : item.token.toLowerCase() === 'eth' ? 'weth' : item.token.toLowerCase()}.svg`} 
                  alt={item.token}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div>
                  <div className="text-sm font-bold text-white">{item.token}</div>
                  <div className="text-xs text-gray-400">{item.price}</div>
                </div>
                <span className={`text-xs font-bold ml-auto ${item.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
