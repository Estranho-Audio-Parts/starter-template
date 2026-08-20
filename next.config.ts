import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Tira o selo do Next que flutua no canto da tela durante o desenvolvimento.
  // Ele atrapalha na hora de mostrar o sistema para alguem.
  devIndicators: false,
};

export default nextConfig;
