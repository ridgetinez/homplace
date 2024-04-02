// doesn't work with wss:// protocol
const socket = new WebSocket("ws://localhost:3000");

function sendRandomChange(ws: WebSocket, dimx: number, dimy: number) {
  let change = {
    x: Math.floor(Math.random() * dimx),
    y: Math.floor(Math.random() * dimy),
    colour: [0, 0, 255, 255],
  };
  ws.send(JSON.stringify(change));
  return change;
}

socket.addEventListener("message", (event) => {
  // console.log(`message: ${event.data}`);
  // socket.send(event.data);
});
socket.addEventListener("open", (event) => {
  console.log(`open: ${event}`);
  let change = sendRandomChange(socket, 64, 64);
  console.log(change);
});
socket.addEventListener("close", (event) => {
  console.log(`close: ${event}`);
});
socket.addEventListener("error", (event) => {
  console.log(`error: ${event}`);
});

function sendFirstMessageOnWSReady() {
  setTimeout(() => {
    if (socket.readyState !== socket.CONNECTING) {
      // socket.send("no u");
    } else {
      console.log("waiting...");
      sendFirstMessageOnWSReady();
    }
  }, 1000);
}
sendFirstMessageOnWSReady();
