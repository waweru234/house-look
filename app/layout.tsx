import type React from "react"
import type { Metadata } from "next"
import { Noto_Serif, Bebas_Neue, Rowdies } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import Head from "next/head"
import Script from "next/script"

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-serif",
})

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas-neue",
})

const rowdies = Rowdies({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-rowdies",
})

export const metadata: Metadata = {
  title: "HouseLook - House Hunting Has Never Been Easier",
  description: "Kenya's premier house-hunting platform for Gen Z. Discover and rent homes with style.",
  generator: "v0.dev",
  icons: {
    icon: "/images/houselooklogo.png",
    shortcut: "/images/houselooklogo.png",
    apple: "/images/houselooklogo.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${notoSerif.variable} ${bebasNeue.variable} ${rowdies.variable}`.trim()}>
      <Head>
        <title>HouseLook - House Hunting Has Never Been Easier</title>
        <link rel="icon" href="/images/houselooklogo.png" />
      </Head>
      <body className="bg-houselook-whitesmoke min-h-screen font-sans antialiased">
        <Navigation />
        {children}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBSzI3CKOvryU6VUz829abXj0VuqrLKelQ&libraries=places`}
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
