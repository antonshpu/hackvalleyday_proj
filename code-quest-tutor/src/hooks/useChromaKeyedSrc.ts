import { useEffect, useState } from 'react';

/** Cache keyed data-URLs so we only process each sprite once. */
const cache = new Map<string, string>();

function keyBlackToTransparent(src: string, threshold = 28): Promise<string> {
  const cached = cache.get(src);
  if (cached) return Promise.resolve(cached);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('2d context unavailable'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] <= threshold && data[i + 1] <= threshold && data[i + 2] <= threshold) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      const url = canvas.toDataURL('image/png');
      cache.set(src, url);
      resolve(url);
    };
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

export function useChromaKeyedSrc(src: string | null): string | null {
  const [keyed, setKeyed] = useState<string | null>(() => (src ? cache.get(src) ?? null : null));

  useEffect(() => {
    if (!src) {
      setKeyed(null);
      return;
    }
    let cancelled = false;
    keyBlackToTransparent(src).then((url) => {
      if (!cancelled) setKeyed(url);
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

  return keyed;
}

export function useChromaKeyedSrcs(srcs: string[]): (string | null)[] {
  const [keyed, setKeyed] = useState<(string | null)[]>(() =>
    srcs.map((s) => cache.get(s) ?? null),
  );

  useEffect(() => {
    let cancelled = false;
    Promise.all(srcs.map((s) => keyBlackToTransparent(s))).then((urls) => {
      if (!cancelled) setKeyed(urls);
    });
    return () => {
      cancelled = true;
    };
  }, [srcs.join('|')]);

  return keyed;
}
