import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/toaster"
import Provider from "@/components/provider"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "News Aggregator",
  description: "Stay updated with the latest news from various sources",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Provider>
              {children}
              <Toaster />
            </Provider>
          </ThemeProvider>
      </body>
    </html>
  )
}

