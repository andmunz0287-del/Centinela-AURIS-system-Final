import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ChatProvider } from "@/components/chat-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Centinela AURIS — Seguridad Inteligente",
  description: "Protección Inteligente en Tiempo Real con tecnología de visión artificial",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
        <ChatProvider />
        <Analytics />
      </body>
    </html>
  )
}
