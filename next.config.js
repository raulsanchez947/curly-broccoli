/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow requests from local network dev origin (adjust port if different)
  allowedDevOrigins: ['http://192.168.1.252:3000']
}

module.exports = nextConfig
