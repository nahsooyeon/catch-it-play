import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/highscore/post",
        destination: "http://beatoffice.com:5192/highscore",
      },
    ];
  },
};

export default nextConfig;
