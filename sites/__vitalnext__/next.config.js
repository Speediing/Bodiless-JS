const NextWebpackConfig = require('@bodiless/next/lib/cjs/Webpack/Config').default;
const bodilessNextConfig = require('@bodiless/next/lib/cjs/NextConfig/nextConfig');

module.exports = {
  ...bodilessNextConfig,
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  webpack: (config, options) => (
    NextWebpackConfig(config, {
      nextWebpack: options
    })
  ),
};
