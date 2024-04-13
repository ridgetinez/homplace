export async function initCanvas(path: string): Promise<Uint8Array> {
  let file = Bun.file(path);
  let data = await file.arrayBuffer();
  return new Uint8Array(data);
}

export function updateCanvas(
  canvas: Uint8Array,
  x: number,
  y: number,
  colour: Uint8Array,
) {
  const base = x * (64 * 4) + y * 4;
  for (var i = 0; i < colour.length; i++) {
    canvas[base + i] = colour[i];
  }
}

export async function syncCanvas(canvas: Uint8Array, canvasPath: string) {
  return Bun.write(canvasPath, canvas);
}
