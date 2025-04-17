/** @type {import('next').NextConfig} */

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: "standalone",
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "localhost",
            },
        ],
    },
    webpack: (config, { webpack }) => { // Note the webpack parameter here
        // Ignore rdf-canonize-native on both client and server
        config.plugins.push(
            new webpack.IgnorePlugin({
                resourceRegExp: /^rdf-canonize-native$/,
            })
        );
        return config;
    },
};

export default nextConfig;
