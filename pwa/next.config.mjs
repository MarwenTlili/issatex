/** @type {import('next').NextConfig} */

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
                port: "",
                pathname: "",
                search: "",
            },
        ],
    },
};

export default nextConfig;
