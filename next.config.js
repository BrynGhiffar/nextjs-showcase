/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["http://localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.wallpaperscraft.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "8d0c-182-253-4-58.ap.ngrok.io"
      }
    ]
  }}

const removeImports = require('next-remove-imports')();

module.exports = removeImports(nextConfig);
