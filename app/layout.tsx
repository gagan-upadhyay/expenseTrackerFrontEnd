import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./ui/navbar";
import Footer from "./ui/footer";
import { AuthProvider } from "./context/authContext";
import { GoogleOAuthProvider } from "@react-oauth/google";


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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <body
        className={`min-h-screen flex flex-col ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <GoogleOAuthProvider clientId="234932173375-gos9gguc3qfajie2iv8vid04jme5n0cu.apps.googleusercontent.com">
        <Navbar/>
        <main className="flex-grow">
          {children}
        </main>
        <Footer/>
        </GoogleOAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
