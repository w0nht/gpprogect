/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // Pacotes Node.js nativos que não devem ser empacotados pelo bundler
  serverExternalPackages: ['bcryptjs', 'mysql2', 'crypto'],
}

export default nextConfig
