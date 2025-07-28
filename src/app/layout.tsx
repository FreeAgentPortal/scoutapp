import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import AlertCenter from "@/layout/alertCenter/AlertCenter.layout";
import { AuthProvider } from "@/layout/authProvider/AuthProvider.layout";
import AuthGuard from "@/layout/authGuard/AuthGuard.layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FAP Scout | Free Agent Portal",
  metadataBase: new URL("https://scout.thefreeagentportal.com"),
  description:
    "The premier scouting platform for discovering and evaluating athletic talent. Search athletes, create detailed reports, and manage your recruiting pipeline with FAP Scout.",
  keywords: [
    "scout",
    "athlete",
    "sports recruitment",
    "talent discovery",
    "free agent portal",
    "athletic evaluation",
    "sports scouting",
    "recruiting platform",
  ],
  authors: [{ name: "Free Agent Portal Team" }],
  creator: "Free Agent Portal",
  publisher: "Free Agent Portal",
  applicationName: "FAP Scout",
  category: "Sports",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fapscout.com",
    siteName: "FAP Scout",
    title: "FAP Scout | Free Agent Portal",
    description: "The premier scouting platform for discovering and evaluating athletic talent.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "FAP Scout - Free Agent Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAP Scout | Free Agent Portal",
    description: "The premier scouting platform for discovering and evaluating athletic talent.",
    images: ["/images/twitter-image.png"],
    creator: "@fapscout",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReactQueryProvider>
          <AlertCenter />
          <AuthProvider>
            <AuthGuard>{children}</AuthGuard>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
