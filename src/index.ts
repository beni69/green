import express from "express";
import { Server } from "ws";

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

setInterval(() => {
    if (!wsServer.clients.size) return;

    console.log("sending da green");
    Array.from(wsServer.clients)[
        Math.floor(Math.random() * wsServer.clients.size)
    ].send("green");
}, 5000);
