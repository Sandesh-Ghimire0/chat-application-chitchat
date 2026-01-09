import WebSocket from "ws";

export interface ClientSocket extends WebSocket {
    userId: string;
}

export interface User {
    id?: string;
    username: string;
    email: string;
    password: string;
    isOnline?: boolean;
    image?: string;
    createdAt?: Date
}

export interface ConnectUserMessage {
    type: "connect";
    userId: string;
}

export interface DisconnectUserMessage {
    type: "disconnect";
    userId: string;
}

export interface ActiveUserMessage {
    type: "active-user";
    activeUserId: string;
}

export interface DeactiveUserMessage {
    type: "deactive-user";
    deactiveUserId: string;
}

export interface ChatMessage {
    type: "chat-message";
    id: string
    from: string;
    to: string;
    content: string;
    createdAt?: Date

}

export type Message = ConnectUserMessage | DisconnectUserMessage | ChatMessage;


