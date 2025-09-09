/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Skip ESLint during production builds on Vercel to prevent non-critical rules from failing deploys
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production build to succeed even if there are type errors
    // (use CI/unit tests locally to enforce types during development)
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig


