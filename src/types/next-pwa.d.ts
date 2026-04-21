declare module "next-pwa" {
  import type { NextConfig } from "next";

  type WithPWA = (config: {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    runtimeCaching?: Array<Record<string, unknown>>;
  }) => (nextConfig: NextConfig) => NextConfig;

  const withPWA: WithPWA;
  export default withPWA;
}
