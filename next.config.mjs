/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/projeler/cv-analiz',
        destination: '/cv-analiz/index.html',
      },
      {
        source: '/projeler/mulakat-simulatoru',
        destination: '/mulakat-simulator/index.html',
      },
      {
        source: '/projeler/sinav-hazirlik',
        destination: '/sinav-hazirlik/index.html',
      },
    ];
  },
};

export default nextConfig;
