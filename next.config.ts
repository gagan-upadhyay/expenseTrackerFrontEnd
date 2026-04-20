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
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "images-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/api\..*$/,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
      },
    },
    {
      urlPattern: /\/_next\/static\//,
      handler: "CacheFirst",
      options: {
        cacheName: "next-static",
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
  ],
});

export default pwaConfig(nextConfig);
