import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  turbopack: {},
  allowedDevOrigins:['192.168.0.126','192.168.0.185', '172.31.144.1'],
  logging:{
    fetches:{
      fullUrl:true,
    }
  },
  images: {
    remotePatterns:
    [  
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol:"https",
        hostname:"expensetrackerappstorage.blob.core.windows.net",
        port:"",
        pathname:"/profile-images/**",
      },
      {
        protocol:"https",
        hostname:"expensetrackerappstorage.blob.core.windows.net",
        port:"",
        pathname:"/transaction-receipts/**",
      }

    ],
    
  },
  async headers() {
    return [
      {
        source: '/manifest.webmanifest',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/offline.html',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'strict-origin',
          },
        ],
      },
    ];
  },
};

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: false,
  disable: process.env.NODE_ENV === "development",
  mode: 'InjectManifest',
  swSrc: "src/service-worker.js",
} as any);

export default pwaConfig(nextConfig);

