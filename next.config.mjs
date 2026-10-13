/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: `npm run build` produces a plain /out folder you can host
  // anywhere (GitHub Pages, Netlify, Vercel).
  output: "export",
  images: { unoptimized: true },
  // Relative asset paths so the build also works from a sub-folder
  // (e.g. username.github.io/repo-name).
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX ?? "./",
  trailingSlash: true,
};
export default nextConfig;
