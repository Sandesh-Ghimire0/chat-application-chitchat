import { WebSocketServer } from "ws";
import type { Server as HttpServer } from "http";
import WebSocket from "ws";
import { nanoid } from "nanoid";
import type { ClientSocket } from "../types/socket.js";
import type {
    ClientToServerMessage,
    ServerToClientMessage,
} from "../types/message.js";
import { redisService } from "./redis.service.js";
import { raw } from "express";

export class WebSocketService {
    private wss: WebSocketServer;

    private myClients = new Map<string, ClientSocket>(); // why ?
    private otherClients = new Map<string, string>();

    private Users: string[] = ["Ram", "Shyam", "Hari", "Sita"];
    private countUser: number = 0;

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
        const clientId: string = nanoid();
        socket.clientId = clientId;

        const username = this.Users[this.countUser];
        if (username !== undefined) {
            socket.username = username;
            this.countUser += 1;
        }

        this.myClients.set(clientId, socket);

        username
            ? console.log(`${username} connected`)
            : console.log(`${clientId} connected`);

        this.sendClientId(socket);

        redisService.publish(
            "CLIENTS",
            JSON.stringify({ type: "connect", clientId, username })
        );

        socket.on("message", async (rawData) => {
            const data: ClientToServerMessage = JSON.parse(rawData.toString())
            if(this.myClients.has(data.to)){
                this.onRedisMessage(rawData.toString())
            }else {
                redisService.publish("MESSAGES", rawData.toString());
            }
        });

        socket.on("close", () => {
            this.handleDisconnect(clientId, username);
        });
    }

    /*============================================================================================================
    //                                               send clientId
    ===============================================================================================================*/
    private sendClientId(socket: ClientSocket) {
        const payload: ServerToClientMessage = {
            type: "client-id",
            clientId: socket.clientId,
        };
        socket.send(JSON.stringify(payload));
    }

    /*============================================================================================================
    //                                              listen to CLIENTS channel
    ===============================================================================================================*/
    private onRedisClients(redisClients: string) {
        const { type, clientId, username } = JSON.parse(redisClients);

        if (type === "disconnect") {
            this.otherClients.delete(clientId);
        }

        if (type === "connect" && !this.myClients.has(clientId)) {
            this.otherClients.set(clientId, username);
        }
        this.boardcastClientList();
    }

    /*============================================================================================================
    //                                              send all clients to each server
    ===============================================================================================================*/
    private boardcastClientList() {
        this.wss.clients.forEach((client)   => {
            const currSocket = client as ClientSocket;

            const sameServerClients = [...this.myClients].flatMap(
                ([clientId, socket]) =>
                    currSocket.clientId !== clientId
                        ? [
                              {
                                  clientId: clientId,
                                  username: socket.username ?? "",
                              },
                          ]
                        : []
            );

            const otherServerClients = [...this.otherClients].map(
                ([clientId, username]) => ({
                    clientId,
                    username,
                })
            );

            const allClients = [...sameServerClients, ...otherServerClients];

            const payload: ServerToClientMessage = {
                type: "all-clients",
                allClients: allClients,
            };
            currSocket.send(JSON.stringify(payload));
        });
    }

    /*============================================================================================================
    //                                               Listen to MESSAGES channel
    ===============================================================================================================*/
    private onRedisMessage(redisMessage: string) {
        const data: ClientToServerMessage = JSON.parse(redisMessage);
        const { from, to, message } = data;

        const payload: ServerToClientMessage = {
            type: "chat-message",
            sendBy: from,
            sendTo: to,
            message,
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
    private handleDisconnect(clientId: string, username?: string) {
        this.myClients.delete(clientId);

        redisService.publish(
            "CLIENTS",
            JSON.stringify({
                type: "disconnect",
                clientId,
                username,
            })
        );

        console.log(`${username} Disconnected`);
    }
}

/*
    private async handleMessage(socket: ClientSocket, rawData: string) {
        await sub.subscribe("MESSAGES", (message) => {
            const data: ClientToServerMessage = JSON.parse(message);
            console.log(data);

            const { to, msg } = data;
            const senderId = socket.clientId;
            const receiverSocket = this.myClients.get(to);

            const payload: ServerToClientMessage = {
                type: "chat-message",
                sendBy: senderId,
                sendTo: to,
                message: msg,
            };

            // send to receiver
            receiverSocket?.send(JSON.stringify(payload));

            // echo back to sender
            socket.send(JSON.stringify(payload));
        });
    }


    private broadcastClientList() {
        this.wss.clients.forEach((client) => {
            const currSocket = client as ClientSocket;

            const allClients = [...this.myClients].flatMap(
                ([clientId, socket]) =>
                    currSocket.clientId !== clientId
                        ? [
                              {
                                  clientId: clientId,
                                  username: socket.username ?? "",
                              },
                          ]
                        : []
            );

            const payload: ServerToClientMessage = {
                type: "all-clients",
                allClients: allClients,
            };

            currSocket.send(JSON.stringify(payload));
        });
    }

*/
