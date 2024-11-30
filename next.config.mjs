/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploadthing",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "subdomain",
      },
      {
        protocol: "https",
        hostname: "uploadthing",
      },
      {
        protocol: "https",
        hostname: "follows-bc85.kxcdn.com",
      },
    ],
    domains: [],
  },
};

export default nextConfig;
