import express from "express";
import WebSocket, { Server } from "ws";

const PORT = process.env.PORT || 3000;

const app = express(),
    wsServer = new Server({ noServer: true }),
    server = app.listen(PORT, () =>
        console.log(`listening on http://127.0.0.1:${PORT}`)
    );

// serve static files
app.use(express.static("public"));

// ws glue code
server.on("upgrade", (req, socket, head) => {
    wsServer.handleUpgrade(req, socket, head, ws => {
        wsServer.emit("connection", ws, req);
    });
});
wsServer.on("connection", () => void console.log("new connection"));
wsServer.on("close", () => void console.log("connection closed"));

let i: number;
let s: WebSocket.WebSocket;
setInterval(() => {
    if (!wsServer.clients.size) return void console.debug("skipped");

    // remove previous
    if (s !== undefined) {
        if (s.readyState === s.CLOSED)
            console.debug(`black: ${i} disconnected`);
        else {
            console.log("sending black: " + i);
            s.send("black");
        }
    }

    i = Math.floor(Math.random() * wsServer.clients.size);
    console.log("sending da green: " + i);
    s = Array.from(wsServer.clients)[i];
    s.send("green");
}, 10000);
