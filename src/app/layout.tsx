import type { Metadata } from "next"
import { Inter, Syne } from "next/font/google"
import "./globals.css"

import { Toaster } from "@/components/ui/sonner"
import { TRPCReactProvider } from "@/trpc/react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
  display: "swap",
})

export const metadata: Metadata = {
  title: "balise — audit RGAA",
  description: "Outil d'audit d'accessibilité numérique RGAA 4.1.2",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${syne.variable}`}
    >
      <body className="font-sans antialiased bg-background text-foreground">
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  )
}
