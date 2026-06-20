import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Autorise les photos de chiens hébergées sur Vercel Blob Storage.
    // À adapter si tu choisis un autre fournisseur de stockage (Supabase, R2...).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
