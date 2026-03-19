function noiseHash(n: number): number {
  const s = Math.sin(n) * 43758.5453;
  return s - Math.floor(s);
}

function valueNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const n = ix + iy * 131;
  const a = noiseHash(n);
  const b = noiseHash(n + 1);
  const c = noiseHash(n + 131);
  const d = noiseHash(n + 132);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

/** Fractal Brownian motion — 5-octave value noise */
export function fbm(x: number, y: number): number {
  let val = 0,
    amp = 0.5;
  for (let o = 0; o < 5; o++) {
    val += amp * valueNoise(x, y);
    x *= 2;
    y *= 2;
    amp *= 0.5;
  }
  return val;
}
