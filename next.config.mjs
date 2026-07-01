/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/projeler/cv-analiz',
        destination: '/cv-analiz/index.html',
      },
    ];
  },
};

export default nextConfig;
