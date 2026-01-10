import "dotenv/config";

import http from "http";
import { app } from "./app.js";
import { WebSocketService } from "./services/socket.service.js";
import { redisService } from "./services/redis.service.js";

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

await redisService.connect();
const wsService = new WebSocketService(server);
wsService.initalize();

server.listen(PORT, () => {
    console.log(new Date() + " Server is listening on port ", PORT);
});
