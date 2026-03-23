import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VibeMap — Drop Your Vibe on the Globe",
  description:
    "See how the world feels right now. Drop your mood on an interactive 3D globe and watch vibes pulse across the planet in real-time.",
  manifest: "/manifest.json",
  themeColor: "#6B73FF",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VibeMap",
  },
  openGraph: {
    title: "VibeMap — Drop Your Vibe on the Globe",
    description:
      "See how the world feels right now. Drop your mood on an interactive 3D globe.",
    type: "website",
    images: ["/api/og"],
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeMap — Drop Your Vibe on the Globe",
    description:
      "See how the world feels right now. Drop your mood on an interactive 3D globe.",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
