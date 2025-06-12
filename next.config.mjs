/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tuqdytehmpzhlbxfvylv.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/vave-assets/**",
      },
    ],
  },
}

export default nextConfig
