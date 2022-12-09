/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["http://localhost"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ]
  }}

const removeImports = require('next-remove-imports')();

module.exports = removeImports(nextConfig);
