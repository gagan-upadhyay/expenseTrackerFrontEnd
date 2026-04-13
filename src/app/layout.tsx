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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Expense Tracker App",
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
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <body
        className={`flex flex-col min-h-screen ${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Analytics/>
        <SpeedInsights/>
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
