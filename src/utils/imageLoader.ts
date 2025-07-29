// Custom image loader for Azure Web Apps compatibility
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // For external URLs, return them as-is without optimization
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // For local images, use the default Next.js behavior
  const params = new URLSearchParams();
  params.set("url", src);
  params.set("w", width.toString());
  if (quality) {
    params.set("q", quality.toString());
  }

  return `/_next/image?${params.toString()}`;
}
