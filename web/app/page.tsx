import Link from 'next/link';
import { Zap, Droplets, ShieldCheck, BarChart3, Cpu, TrendingUp } from 'lucide-react';
import SwapInterface from '../components/swap-interface';

export default function HomePage() {
  const metrics = [
    { 
      label: 'Total Value Locked', 
      value: '$42.8B',
      subtext: 'across all pools',
      change: '+12.5%' 
    },
    { 
      label: 'Daily Volume', 
      value: '$840M',
      subtext: 'average execution', 
      change: '+8.2%' 
    },
    { 
      label: 'Active Traders', 
      value: '127K+',
      subtext: 'professional users', 
      change: '+24.3%' 
    },
  ];

  const features = [
    {
      icon: 'zap',
      title: 'Execution Excellence',
      description: 'Our smart order routing technology ensures maximum slippage and optimal exit points across fragmented liquidity.',
      cta: 'EXPLORE ENGINE',
    },
    {
      icon: 'droplets',
      title: 'Deep Liquidity',
      description: 'Access deep institutional liquidity through our prime network execution and proprietary market makers.',
      cta: 'LIQUIDITY MAP',
    },
    {
      icon: 'shield',
      title: 'Regulatory Integrity', 
      description: 'Operate with confidence under our multi-jurisdictional compliance framework designed for institutional standards.',
      cta: 'COMPLIANCE DOCS',
    },
  ];

  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container relative z-10">
          <div className="mx-auto max-w-6xl text-center">
            <div className="mb-8 inline-block rounded-full glass-effect golden-border px-6 py-3 text-sm fade-in hover-glow">
              <span className="golden-text-gradient font-bold tracking-wide">
                 ESTABLISHED PERFORMANCE
              </span>
            </div>
            
            <h1 className="mb-8 text-5xl lg:text-8xl font-bold tracking-tight fade-in">
              <span className="text-white">The New Standard</span>
              <br />
              <span className="golden-text-gradient not-italic">in Digital&nbsp;</span>
              <span className="golden-text-gradient capital-highlight">Capital</span>
            </h1>
            
            <p className="mb-12 text-lg lg:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed fade-in">
              Stop losing money to high fees and poor execution. ZoneX delivers bank-grade trading 
  infrastructure with transparent pricing and guaranteed best execution for every trade.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center fade-in">
              <Link
                href="/sign-up"
                className="golden-gradient hover-glow px-12 py-5 rounded-xl text-black font-bold text-lg tracking-wide transition-all duration-300 hover:scale-110 hover-lift shimmer shadow-2xl relative group"
              >
                <span className="relative z-10">GET STARTED →</span>
                <div className="absolute inset-0 golden-gradient rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              </Link>
              <Link
                href="/trade"
                className="glass-effect golden-border hover-glow px-10 py-5 rounded-xl text-yellow-100 font-semibold text-lg tracking-wide transition-all duration-300 hover:scale-105 shadow-xl"
              >
                EXPLORE TRADING
              </Link>
            </div>
          </div>
        </div>
        
        {/* Enhanced Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-linear-to-br from-yellow-400/10 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-linear-to-br from-yellow-400/10 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-linear-to-r from-transparent via-yellow-400/5 to-transparent" />
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-3">
            {metrics.map((metric, index) => (
              <div key={metric.label} className={`glass-effect golden-border rounded-2xl p-8 hover-lift hover-glow fade-in`} style={{animationDelay: `${index * 0.2}s`}}>
                <div className="text-center">
                  <div className="text-xs uppercase tracking-widest text-yellow-400 mb-3 font-bold">
                    {metric.label}
                  </div>
                  <div className="text-4xl lg:text-5xl font-bold golden-text-gradient mb-2">
                    {metric.value}
                  </div>
                  <div className="text-sm text-yellow-200 mb-2 font-medium">
                    {metric.subtext}
                  </div>
                  <div className="text-xs text-green-400 font-bold bg-green-400/10 px-3 py-1 rounded-full inline-block">
                    {metric.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trading Interface Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 golden-text-gradient leading-tight">
              Start Trading
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Experience lightning-fast swaps with minimal fees and maximum security
            </p>
          </div>
          
          <div className="flex justify-center">
            <SwapInterface />
          </div>
        </div>
        
        {/* Background Effects */}
        <div className="absolute inset-0 golden-gradient opacity-5"></div>
        <div className="absolute -top-40 -left-40 w-80 h-80 golden-gradient rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 golden-gradient rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              Unparalleled Service Excellence
            </h2>
            <div className="w-24 h-1 golden-gradient mx-auto rounded-full shadow-lg" />
          </div>
          
          <div className="grid gap-8 lg:grid-cols-3">
            {features.map((feature, index) => {
              const IconComponent = feature.icon === 'zap' ? Zap : feature.icon === 'droplets' ? Droplets : ShieldCheck;
              return (
                <div key={feature.title} className={`glass-effect golden-border rounded-2xl p-8 hover-lift hover-glow fade-in group`} style={{animationDelay: `${index * 0.3}s`}}>
                  <div className="w-14 h-14 golden-gradient rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-amber-500/20">
                    <IconComponent className="w-7 h-7 text-black" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-yellow-100 group-hover:text-yellow-50 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed text-sm group-hover:text-gray-200 transition-colors">
                    {feature.description}
                  </p>
                  <button className="text-xs font-bold tracking-widest golden-text-gradient hover:scale-105 transition-transform duration-300 bg-yellow-500/10 px-4 py-2 rounded-lg border border-yellow-500/30 hover-glow">
                    {feature.cta} →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Data Visualization Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs uppercase tracking-widest text-yellow-400 mb-4 font-bold">
              THE TERMINAL EXPERIENCE
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
              Advanced Data
              <br />
              <span className="golden-text-gradient">Visualization Suite</span>
            </h2>
            <p className="text-gray-300 mb-12 leading-relaxed text-lg max-w-3xl mx-auto">
              ZoneX integrates best-in-class charting with ultra-low latency data 
              feeds. Our proprietary terminal is engineered for high-frequency 
              analysis and institutional-grade execution precision.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="glass-effect golden-border rounded-xl p-6 hover-glow transition-all hover:scale-105">
                <div className="w-12 h-12 golden-gradient rounded-full mb-4 mx-auto flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-black" strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-lg mb-3 golden-text-gradient">Multi-Asset Correlation</h3>
                <p className="text-gray-400 text-sm">Advanced correlation matrices for cross-asset analysis and risk assessment</p>
              </div>
              
              <div className="glass-effect golden-border rounded-xl p-6 hover-glow transition-all hover:scale-105">
                <div className="w-12 h-12 golden-gradient rounded-full mb-4 mx-auto flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-black" strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-lg mb-3 golden-text-gradient">Algorithmic Orders</h3>
                <p className="text-gray-400 text-sm">Customizable order types with smart execution algorithms</p>
              </div>
              
              <div className="glass-effect golden-border rounded-xl p-6 hover-glow transition-all hover:scale-105">
                <div className="w-12 h-12 golden-gradient rounded-full mb-4 mx-auto flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-black" strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-lg mb-3 golden-text-gradient">Real-Time Analytics</h3>
                <p className="text-gray-400 text-sm">Live derivatives pricing and maximum value delivery</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="golden-gradient hover-glow px-8 py-4 rounded-xl text-black font-bold text-sm tracking-wide transition-all duration-300 hover:scale-105 shadow-xl">
                REQUEST API DOCUMENTATION →
              </button>
              <button className="glass-effect golden-border hover-glow px-8 py-4 rounded-xl text-yellow-100 font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105 shadow-xl">
                VIEW DEMO
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="glass-effect golden-border rounded-3xl p-12 lg:p-16 text-center relative overflow-hidden hover-glow">
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
                Ready for the Next Era?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join our exclusive network of institutional investors and liquidity 
                providers today.
              </p>
              <Link
                href="/trade"
                className="inline-block golden-gradient hover-glow px-10 py-4 rounded-xl text-black font-bold text-sm tracking-wide transition-all duration-300 hover:scale-105 shimmer shadow-2xl"
              >
                INITIATE ONBOARDING →
              </Link>
            </div>
            
            {/* Enhanced Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-yellow-400/8 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-br from-yellow-400/8 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-yellow-400/3 to-transparent" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}