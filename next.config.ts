import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins:['192.168.0.126'],
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

export default nextConfig;