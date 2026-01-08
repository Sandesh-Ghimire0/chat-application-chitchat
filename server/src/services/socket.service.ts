import { WebSocketServer } from "ws";
import type { Server as HttpServer } from "http";
import type { ActiveUserMessage, ChatMessage, ClientSocket, DeactiveUserMessage } from "../types/type.js";
import type { Message } from "../types/type.js";
import { redisService } from "./redis.service.js";
import { messages, users } from "../data/data.js";
import { nanoid } from "nanoid";

export class WebSocketService {
    private wss: WebSocketServer;

    private myClients = new Map<string, ClientSocket>(); // why ?
    private otherClients: string[] = [];

    constructor(server: HttpServer) {
        this.wss = new WebSocketServer({ server });

        // onRedisMessage func executes whenever there is a message published to the channel MESSAGES
        redisService.subscribe("MESSAGES", this.onRedisMessage.bind(this));

        redisService.subscribe("CLIENTS", this.onRedisClients.bind(this));
    }

    initalize() {
        console.log("Web socket service initialized");

        this.wss.on("connection", (socket: ClientSocket) => {
            this.handleConnection(socket);
        });
    }

    /*============================================================================================================
    //                                               handle connection
    ===============================================================================================================*/
    private handleConnection(socket: ClientSocket) {
        socket.on("message", async (rawData) => {
            const data: Message = JSON.parse(rawData.toString());
            if (data.type === "connect") {
                this.activateUser(data.userId, socket);
            }

            if (data.type === "chat-message" && this.myClients.has(data.to)) {
                this.onRedisMessage(rawData.toString());
            } else {
                redisService.publish("MESSAGES", rawData.toString());
            }

            if (data.type === "disconnect") {
                this.handleDisconnect(data.userId);
            }
        });

        socket.on("close", () => {
            const userId = socket.userId;
            if (userId) {
                this.handleDisconnect(userId);
            }
        });
    }

    private activateUser(userId: string, socket: ClientSocket) {
        socket.userId = userId;
        this.myClients.set(userId, socket);
        const user = users.find((user) => user.id === userId);
        if (user) {
            user.isOnline = true;
        }
        console.log(`${userId} connected`); 
        redisService.publish(
            "CLIENTS",
            JSON.stringify({ type: "connect", userId })
        );
    }

    /*============================================================================================================
    //                                              listen to CLIENTS channel
    ===============================================================================================================*/
    private onRedisClients(redisClients: string) {
        const { type, userId } = JSON.parse(redisClients);

        if (type === "disconnect") {
            const user = users.find((user) => user.id === userId);
            if (user) {
                user.isOnline = false;
            }
            const index = this.otherClients.indexOf(userId);
            if (index !== -1) {
                this.otherClients.splice(index, 1);
            }
        }

        if (type === "connect" && !this.myClients.has(userId)) {
            this.otherClients.push(userId);
        }
        this.boardcastUserConnection(type, userId);
    }

    /*============================================================================================================
    //                                              send all clients to each server
    ===============================================================================================================*/
    private boardcastUserConnection(type: string, userId: string) {
        this.wss.clients.forEach((client) => {
            const currSocket = client as ClientSocket;

            if (currSocket.userId !== userId) {
                const payload: ActiveUserMessage | DeactiveUserMessage =
                    type === "connect"
                        ? {
                              type: "active-user",
                              activeUserId: userId,
                          }
                        : {
                              type: "deactive-user",
                              deactiveUserId: userId,
                          };

                currSocket.send(JSON.stringify(payload));
            }
        });
    }

    /*============================================================================================================
    //                                               Listen to MESSAGES channel
    ===============================================================================================================*/
    private onRedisMessage(redisMessage: string) {
        const data: ChatMessage = JSON.parse(redisMessage);
        const { from, to, content } = data;

        const msgId: string = nanoid();
        const msg: Omit<ChatMessage,'type'> = {
            id: msgId,
            from,
            to,
            content,
        };
        messages.push(msg);

        const payload: Message = {
            type: "chat-message",
            id: msgId,
            from,
            to,
            content,
        };

        // send to receiver
        const receiverSocket = this.myClients.get(to);
        receiverSocket?.send(JSON.stringify(payload));

        // echo back to sender
        const senderSocket = this.myClients.get(from);
        senderSocket?.send(JSON.stringify(payload));
    }

    /*============================================================================================================
    //                                               handle disconnection
    ===============================================================================================================*/
    private handleDisconnect(userId: string) {
        this.myClients.delete(userId);

        redisService.publish(
            "CLIENTS",
            JSON.stringify({
                type: "disconnect",
                userId,
            })
        );

        console.log(`${userId} Disconnected`);
    }
}
