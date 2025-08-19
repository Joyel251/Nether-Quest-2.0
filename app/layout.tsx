
import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import ClientLayout from "./ClientLayout"
import "./globals.css"

const minecraftFont = localFont({
  src: "../public/fonts/MinecraftTen-VGORe.ttf",
  weight: "400",
  display: "swap",
  variable: "--font-minecraft",
})

export const metadata: Metadata = {
  title: "Nether Quest 2.0",
  description: "Embark on an epic adventure in the Nether",
  generator: 'v0.app',
  icons: { icon: "/favicon.png" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${minecraftFont.variable} antialiased`}>
      <body className="font-minecraft custom-cursor">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
