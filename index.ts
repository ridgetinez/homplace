// todo: serialise and deserialise over websockets
interface Message<T> {
  // todo: sequence numbers to ensure clients are synced
  seqno: number;
  // todo: how do you define unique msg types?
  msgtype: number;
  data: T;
}

// StartupMessage is a message that sends the initial PNG to the client.
type StartupMessage = Message<Blob>;

const canvasImagePath = "./place";

// load png into memory so we can make modifications in place

async function initCanvas(path: string): Promise<Uint8Array> {
  let file = Bun.file(path);
  let data = await file.arrayBuffer();
  return new Uint8Array(data);
  // let context = new CanvasPattern();
  // let image = new HTMLImageElement();
  // image.src = `data:image/png;base64,${data}`;
  // context.drawImage(image, 0, 0);
  // return Promise.resolve(context.getImageData(0, 0, 64, 64));
}
// function updateCanvas(x: number, y: number): ArrayBuffer {}

let canvas = await initCanvas(canvasImagePath);
console.log(canvas);

function updateCanvas(x: number, y: number, colour: Uint8Array) {
  const base = x * (64 * 4) + y * 4;
  console.log(base, colour.length);
  for (var i = 0; i < colour.length; i++) {
    console.log(base + i);
    canvas[base + i] = colour[i];
  }
}

async function syncCanvas(canvasPath: string) {
  return Bun.write(canvasPath, canvas);
}

const server = Bun.serve({
  fetch(req, server) {
    if (server.upgrade(req)) {
      return; // do not return a Response
    }
    return new Response("Upgrade failed :(", { status: 500 });
  },
  websocket: {
    async open(ws) {
      // send initial state
      ws.send(canvas);
      // subscribe to new-events topic
    },
    async message(ws, message: string) {
      console.log(`recieved ${message}`);
      let delta = JSON.parse(message);
      // publish to all listeners
      updateCanvas(delta.x, delta.y, delta.colour);
      console.log(canvas[delta.x * (64 * 4) + delta.y * 4]);
      await syncCanvas(canvasImagePath);
    },
    async close() {
      console.log("closing");
    },
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
