import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ZoneX - Professional DeFi Trading',
  description: 'Institutional-grade decentralized exchange with concentrated liquidity',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#F59E0B',
          colorBackground: '#0a0a0a',
          colorText: '#f5f5f5',
        },
      }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      <html lang="en">
        <body className={inter.className}>
          <Providers>
            <Header />
            <main className="relative">
              {children}
            </main>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}