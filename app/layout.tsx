import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  // SignedIn,
  SignedOut,
  // UserButton
} from '@clerk/nextjs'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { PostHogProvider } from "@/components/PostHogProvider"


const cormorantGaramond = Cormorant_Garamond({
  weight: ['300','400','500','600','700'],
  variable: '--font-cormorant-garamond',
  subsets: ['latin'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Veevo",
  description: "Showcase your affiliate products in one place",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          socialButtonsPlacement: 'top',
          socialButtonsVariant: 'auto',
        }
      }}
    >
      <html lang="en" className={`${cormorantGaramond.variable} ${inter.variable}`}>
        <body>
          <PostHogProvider>
            {children}
            <Toaster />
            <SpeedInsights />
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
