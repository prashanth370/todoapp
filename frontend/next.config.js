/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        "supports-color": false,
      };
    }
    return config;
  },
  // Add any additional configuration here if needed
};

module.exports = nextConfig;
