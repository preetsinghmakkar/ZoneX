'use client';

import { SignUp } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-linear-to-br from-yellow-400/15 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-linear-to-br from-amber-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-linear-to-r from-transparent via-yellow-400/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold golden-text-gradient mb-3">Join ZoneX</h1>
          <p className="text-gray-400">Create your account and start trading</p>
        </div>
        <SignUp
          appearance={{
            baseTheme: dark,
            elements: {
              rootBox: 'mx-auto',
              card: 'bg-black/60 backdrop-blur-xl border border-amber-500/20 shadow-2xl shadow-amber-500/10',
              headerTitle: 'golden-text-gradient',
              headerSubtitle: 'text-gray-400',
              socialButtonsBlockButton: 'bg-white/5 border-amber-500/20 hover:bg-amber-500/10 hover:border-amber-500/40 transition-all duration-300',
              socialButtonsBlockButtonText: 'text-gray-200',
              formButtonPrimary: 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-500/40',
              formFieldInput: 'bg-white/5 border-amber-500/20 text-white focus:border-amber-500/50 focus:ring-amber-500/20',
              formFieldLabel: 'text-gray-300',
              footerActionLink: 'text-amber-400 hover:text-amber-300',
              identityPreviewEditButton: 'text-amber-400',
              formResendCodeLink: 'text-amber-400',
              dividerLine: 'bg-amber-500/20',
              dividerText: 'text-gray-500',
            },
            variables: {
              colorPrimary: '#F59E0B',
              colorBackground: 'transparent',
              colorText: '#f5f5f5',
              colorTextSecondary: '#9ca3af',
              borderRadius: '0.75rem',
            },
          }}
          forceRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
