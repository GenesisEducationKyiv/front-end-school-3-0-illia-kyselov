import type { NextConfig } from 'next'

import withBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzerConfigured = withBundleAnalyzer({
    enabled: process.env.npm_lifecycle_event === 'analyze',
});

const baseConfig: NextConfig = {
    reactStrictMode: true,

    productionBrowserSourceMaps: true,

    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8000/api/:path*',
            },
        ]
    },

    webpack(config) {
        return config
    },
}

export default withBundleAnalyzerConfigured(baseConfig)
