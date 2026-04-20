import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


import { AuthProvider } from "../context/authContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import NavBarWrapper from "../components/navbar/navbarWrapper";
import FooterWrapper from "../components/layout/footerWrapper";
import { ThemeProvider } from "../context/themeContext";
import ThemeSync from "../components/dashboard/ThemeSync";
import { getInitialAuth } from "../utils/authFunctions";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { PWARegister } from "../components/PWARegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expense Tracker - Smart Finance Management",
  description: "Track expenses, manage accounts, and analyze spending patterns with Expense Tracker PWA",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Expense Tracker",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Expense Tracker",
    description: "Track expenses, manage accounts, and analyze spending patterns",
    type: "website",
    locale: "en_US",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  viewportFit: "cover",
  themeColor: "#000000",
};

// const queryClient = new QueryClient();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialToken = await getInitialAuth();
  
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Expense Tracker" />
        <link rel="apple-touch-icon" href="/logo_192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/logo_192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/logo_512.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body
        className={`flex flex-col min-h-screen ${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Analytics/>
        <SpeedInsights/>
        <PWARegister />
        <ThemeProvider>
          <AuthProvider initialToken={initialToken}>
            <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID ?? ""}>
              <NavBarWrapper />
              <ThemeSync />
              {/* <AuthModalProvider> */}
              {/* 1. Main fills available space, pushing footer down */}
              <main className="flex-grow">
                {children}
              </main>
              {/* <AuthModal/> */}
              {/* 2. Footer Wrapper follows the main flow */}
              {/* </AuthModalProvider> */}
              <FooterWrapper />
            </GoogleOAuthProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
