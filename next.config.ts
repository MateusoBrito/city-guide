import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ], // 👈 Era aqui: trocado ; por , e fechando o array corretamente
  }, // 👈 Faltava fechar o bloco images
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb", 
    },
  },
};

export default nextConfig;