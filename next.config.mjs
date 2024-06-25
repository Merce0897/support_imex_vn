/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    experimental: {
        outputFileTracingIncludes: {
            '/api/khai-bao-hoa-chat': ['./tmp/**/*'],
        },
    },
};

export default nextConfig;
