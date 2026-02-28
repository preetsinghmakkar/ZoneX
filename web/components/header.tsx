'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/nextjs';
import { useDisconnect } from 'wagmi';
import { cn } from '@/lib/utils';
import {
  User, Settings, LogOut, Wallet, ChevronDown,
  LayoutDashboard, Globe
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Trade', href: '/trade' },
  { name: 'Liquidity', href: '/liquidity' },
  { name: 'Pools', href: '/pools' },
  { name: 'Analytics', href: '/analytics' },
];

export function Header() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();
  const { disconnect } = useDisconnect();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="container mx-auto">
        <nav className="glass-effect golden-border rounded-2xl px-6 py-4 backdrop-blur-xl hover-glow">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex items-center space-x-3">
              <div className="golden-gradient rounded-lg p-2 group-hover:scale-105 transition-transform duration-300 hover-glow">
                <div className="h-6 w-6 bg-black rounded-sm flex items-center justify-center">
                  <span className="text-yellow-400 font-bold text-sm">Z</span>
                </div>
              </div>
              <span className="golden-text-gradient font-bold text-2xl tracking-tight hover:scale-105 transition-transform duration-300">
                ZONEX
              </span>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover-lift hover-glow',
                    pathname === item.href
                      ? 'golden-gradient text-black shadow-lg font-semibold'
                      : 'text-white hover:text-yellow-300 hover:bg-yellow-500/10 hover:shadow-lg'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right: Web3 Pills + Web2 Profile */}
            <div className="flex items-center space-x-2">
              <SignedIn>
                {/* Web3 Wallet */}
                <ConnectButton.Custom>
                  {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                    const ready = mounted;
                    const connected = ready && account && chain;
                    return (
                      <div {...(!ready && { 'aria-hidden': true, style: { opacity: 0, pointerEvents: 'none' as const, userSelect: 'none' as const } })}>
                        {(() => {
                          if (!connected) {
                            return (
                              <button onClick={openConnectModal} type="button"
                                className="flex items-center gap-2 golden-gradient hover-glow px-4 py-2 rounded-full text-black font-bold text-xs transition-all duration-300 hover:scale-105 shadow-lg"
                              >
                                <Wallet className="w-3.5 h-3.5" />
                                Connect Wallet
                              </button>
                            );
                          }
                          return (
                            <div className="flex items-center space-x-1.5">
                              {/* Network Pill */}
                              <button onClick={openChainModal} type="button"
                                className="flex items-center gap-1.5 bg-white/5 border border-white/10 hover:border-amber-500/40 px-3 py-2 rounded-full text-xs transition-all duration-300 hover:bg-amber-500/10"
                              >
                                {chain?.hasIcon && chain?.iconUrl ? (
                                  <img alt={chain.name ?? 'Chain'} src={chain.iconUrl} className="w-4 h-4 rounded-full" />
                                ) : (
                                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                                )}
                                <span className="text-gray-300 font-medium">{chain?.name ?? 'Network'}</span>
                              </button>
                              {/* Wallet Pill */}
                              <button onClick={openAccountModal} type="button"
                                className="flex items-center gap-1.5 bg-white/5 border border-white/10 hover:border-amber-500/40 px-3 py-2 rounded-full text-xs transition-all duration-300 hover:bg-amber-500/10"
                              >
                                <Wallet className="w-3.5 h-3.5 text-amber-400" />
                                <span className="text-gray-300 font-medium">{account.displayName}</span>
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  }}
                </ConnectButton.Custom>

                {/* Profile Dropdown (Clerk Web2) */}
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-1.5 ml-1 p-1 rounded-full border-2 border-amber-500/40 hover:border-amber-500/70 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10"
                  >
                    {user?.imageUrl ? (
                      <img src={user.imageUrl} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full golden-gradient flex items-center justify-center">
                        <span className="text-black font-bold text-xs">{user?.firstName?.[0] || user?.username?.[0] || 'U'}</span>
                      </div>
                    )}
                    <ChevronDown className={cn('w-3.5 h-3.5 text-gray-400 mr-1 transition-transform duration-200', profileOpen && 'rotate-180')} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-black/95 backdrop-blur-xl border border-amber-500/20 rounded-xl shadow-2xl shadow-black/50 overflow-hidden fade-in z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-amber-500/10">
                        <p className="text-sm font-bold text-white truncate">{user?.fullName || user?.username || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress || ''}</p>
                      </div>
                      <div className="py-1">
                        <Link href="/dashboard" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        <button onClick={() => setProfileOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
                        >
                          <User className="w-4 h-4" /> Profile
                        </button>
                        <button onClick={() => setProfileOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
                        >
                          <Settings className="w-4 h-4" /> Settings
                        </button>
                      </div>
                      <div className="border-t border-amber-500/10 py-1">
                        <ConnectButton.Custom>
                          {({ account, openConnectModal, mounted }) => {
                            const connected = mounted && account;
                            return connected ? (
                              <button onClick={() => { disconnect(); setProfileOpen(false); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 transition-colors"
                              >
                                <Wallet className="w-4 h-4" /> Disconnect Wallet
                              </button>
                            ) : (
                              <button onClick={() => { openConnectModal(); setProfileOpen(false); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
                              >
                                <Wallet className="w-4 h-4" /> Connect Wallet
                              </button>
                            );
                          }}
                        </ConnectButton.Custom>
                        <button onClick={() => { setProfileOpen(false); signOut({ redirectUrl: '/' }); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </SignedIn>

              <SignedOut>
                <Link href="/sign-in"
                  className="glass-effect golden-border hover-glow px-5 py-2.5 rounded-xl text-yellow-100 font-semibold text-sm transition-all duration-300 hover:scale-105"
                >
                  Sign In
                </Link>
                <Link href="/sign-up"
                  className="golden-gradient hover-glow px-5 py-2.5 rounded-xl text-black font-bold text-sm transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Get Started
                </Link>
              </SignedOut>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
