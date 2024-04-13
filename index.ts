import * as canvasUtils from "./canvas.ts";

const canvasImagePath = "./place";
let canvas = await canvasUtils.initCanvas(canvasImagePath);

const server = Bun.serve({
  fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }
    return new Response("Upgrade failed :(", { status: 500 });
  },
  websocket: {
    async open(ws) {
      ws.subscribe("canvas-changes");
      ws.send(canvas);
    },
    async message(ws, message: string) {
      let delta = JSON.parse(message);
      canvasUtils.updateCanvas(canvas, delta.x, delta.y, delta.colour);
      await canvasUtils.syncCanvas(canvas, canvasImagePath);
      ws.publish("canvas-changes", delta);
    },
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
