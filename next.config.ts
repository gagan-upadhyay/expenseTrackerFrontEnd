import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers(){
    return[
      {
        source: '/(.*)', //apply to all routes
        headers:[
          {
            key:'Referrer-Policy',
            value:'strict-origin', // or use ' or 'same-origin' no-referrer-when-downgrade
          },
        ],
      },
    ];
  },
};

export default nextConfig;
