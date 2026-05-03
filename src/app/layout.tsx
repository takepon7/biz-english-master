import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { AddToHomeScreenBanner } from "@/components/AddToHomeScreenBanner";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0f172a",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_NAME = "Biz English Master";
const APP_SHORT_NAME = "BizEnglish";

export const metadata: Metadata = {
  title: "biz-english-master | 外資で使うビジネス英語を、12シナリオで最短習得",
  description:
    "英語が話せないんじゃない、業務で使う英語の '型' を知らないだけ。入社1日目から評価面談まで、外資・グローバル企業で本当に必要なビジネス英語を、12シナリオ × 3企業文化モードで学べる AI ロールプレイサービス。",
  openGraph: {
    title: "biz-english-master",
    description:
      "外資・グローバル企業で本当に使うビジネス英語を、12シナリオで最短習得。",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "biz-english-master",
    description:
      "外資・グローバル企業で本当に使うビジネス英語を、12シナリオで最短習得。",
  },
  applicationName: APP_NAME,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_SHORT_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <AddToHomeScreenBanner />
        </body>
      </html>
    </ClerkProvider>
  );
}
