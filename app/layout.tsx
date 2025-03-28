import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  // SignedIn,
  SignedOut,
  // UserButton
} from '@clerk/nextjs'
import { SpeedInsights } from "@vercel/speed-insights/next"

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

const cormorantGaramond = Cormorant_Garamond({
  weight: ['300','400','500','600','700'],
  variable: '--font-cormorant-garamond',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Veevo",
  description: "Showcase your affiliate products in one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
      layout: {
        socialButtonsPlacement: 'top',
        socialButtonsVariant: 'auto',
      }
    }}>
      <html lang="en" className={cormorantGaramond.variable}>
        <body> 
          {children}
          <Toaster />
          <SpeedInsights/>
        </body>
      </html>
    </ClerkProvider>
  )
}
