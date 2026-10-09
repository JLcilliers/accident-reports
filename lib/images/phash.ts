import sharp from "sharp";

const BITS = [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4];

/**
 * 64-bit difference hash (dHash) as 16 hex characters: each bit says whether a pixel of a 9x8 greyscale
 * copy is brighter than its right-hand neighbour. Near-identical pictures land a few bits apart.
 */
export async function dHash(image: Buffer): Promise<string> {
  const px = await sharp(image).greyscale().resize(9, 8, { fit: "fill" }).raw().toBuffer();
  let hex = "";
  for (let bit = 0; bit < 64; bit += 4) {
    let nibble = 0;
    for (let i = bit; i < bit + 4; i++) {
      const y = Math.floor(i / 8);
      const x = i % 8;
      nibble = (nibble << 1) | (px[y * 9 + x] > px[y * 9 + x + 1] ? 1 : 0);
    }
    hex += nibble.toString(16);
  }
  return hex;
}

/** Number of bits that differ between two hashes: 0 is identical, 64 the opposite. */
export function hashDistance(a: string, b: string): number {
  let n = 0;
  for (let i = 0; i < 16; i++) n += BITS[parseInt(a[i], 16) ^ parseInt(b[i], 16)];
  return n;
}

/** Hash of an image stored before hashes were recorded, or null when it can't be fetched. */
export async function hashFromUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5_000) });
    return res.ok ? await dHash(Buffer.from(await res.arrayBuffer())) : null;
  } catch {
    return null;
  }
}
