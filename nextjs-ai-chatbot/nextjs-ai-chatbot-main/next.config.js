/**
 * Next.js config for the chatbot app.
 * Remove unsupported experimental keys and set turbopack.root to an absolute path.
 * Add webpack resolve aliases to avoid Turbopack resolution issues in nested workspaces.
 */
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: TypeScript build errors should be fixed. `ignoreBuildErrors` was
  // temporarily used during iteration and has been removed to enforce strict
  // type-checking for production builds.


  // Provide webpack aliases so imports resolve to this package's node_modules
  webpack: (config) => {
    const aliases = {
      '@radix-ui/react-dismissable-layer': path.resolve(__dirname, 'node_modules/@radix-ui/react-dismissable-layer'),
      '@radix-ui/react-visually-hidden': path.resolve(__dirname, 'node_modules/@radix-ui/react-visually-hidden'),
      'remark-cjk-friendly-gfm-strikethrough': path.resolve(__dirname, 'node_modules/remark-cjk-friendly-gfm-strikethrough')
    };
    config.resolve = config.resolve || {};
    config.resolve.alias = Object.assign({}, config.resolve.alias || {}, aliases);
    return config;
  }
};

module.exports = nextConfig;
