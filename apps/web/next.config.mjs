/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    serverActions: {
      bodySizeLimit: "4mb"
    }
  },
  transpilePackages: ["@quillborn/ui", "@quillborn/types"],
  eslint: {
    ignoreDuringBuilds: false
  }
};

export default nextConfig;
