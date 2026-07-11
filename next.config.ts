import dns from "node:dns"
dns.setServers(['8.8.8.8', '8.8.4.4']);

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
