import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  reactCompiler: true,
};

const pwa = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

export default pwa(nextConfig);
