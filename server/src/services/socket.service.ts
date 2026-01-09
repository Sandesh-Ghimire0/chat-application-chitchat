import { WebSocketServer } from "ws";
import type { Server as HttpServer } from "http";
import type {
    ActiveUserMessage,
    ChatMessage,
    ClientSocket,
    DeactiveUserMessage,
} from "../types/type.js";
import type { Message } from "../types/type.js";
import { redisService } from "./redis.service.js";
import prisma from "../config/db.js";

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

            if (data.type === "chat-message") {
                // receiver is on this server
                if (this.myClients.has(data.to)) {
                    await this.onRedisMessage(rawData.toString());
                } else {
                    // receiver is on another server
                    redisService.publish("MESSAGES", rawData.toString());
                }
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

    private async activateUser(userId: string, socket: ClientSocket) {
        socket.userId = userId;
        this.myClients.set(userId, socket);
        // updating the user online status to active
        await prisma.user.update({
            where: { id: userId },
            data: {
                isOnline: true,
            },
        });
        console.log(`${userId} connected`);
        redisService.publish(
            "CLIENTS",
            JSON.stringify({ type: "connect", userId })
        );
    }

    /*============================================================================================================
    //                                              listen to CLIENTS channel
    ===============================================================================================================*/
    private async onRedisClients(redisClients: string) {
        const { type, userId } = JSON.parse(redisClients);

        if (type === "disconnect") {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    isOnline: false,
                },
            });
        }

        if (type === "connect" && !this.myClients.has(userId)) {
            this.otherClients.push(userId);
        }
        this.boardcastUserConnection(type, userId);
    }

    /*============================================================================================================
    //                              send online or offline client info to each server
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
    private async onRedisMessage(redisMessage: string) {
        const data: ChatMessage = JSON.parse(redisMessage);
        const { from, to, content } = data;

        const msg = await prisma.message.create({
            data: {
                from,
                to,
                content,
            },
        });

        const payload: Message = {
            type: "chat-message",
            id: msg.id,
            from: msg.from,
            to: msg.to,
            content: msg.content,
            createdAt: msg.createdAt,
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
