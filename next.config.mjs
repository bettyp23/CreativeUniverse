/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: `npm run build` produces a plain /out folder you can host
  // anywhere (Vercel, Netlify, GitHub Pages with a custom domain).
  output: "export",
  images: { unoptimized: true },
  // Assets load from the domain root, which project pages under /projects/ need.
  // Set NEXT_PUBLIC_ASSET_PREFIX only if the site is served from a sub-folder.
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || undefined,
  trailingSlash: true,
};
export default nextConfig;
