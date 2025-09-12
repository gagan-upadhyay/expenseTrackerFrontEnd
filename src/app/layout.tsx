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

// import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

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
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <body
        className={`min-h-screen flex flex-col ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <QueryClientProvider client={queryClient}> */}
        <ThemeProvider>
        <AuthProvider initialToken={initialToken}>
        <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID ?? ""}>
        <NavBarWrapper/>
        <ThemeSync/>
          <main className="flex-grow">
            {children}
          </main>
        <FooterWrapper/>
        </GoogleOAuthProvider>
        </AuthProvider>
        </ThemeProvider>
        {/* </QueryClientProvider> */}
      </body>
    </html>
  );
}
