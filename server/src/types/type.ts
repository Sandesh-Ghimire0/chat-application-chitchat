import WebSocket from "ws";

export interface ClientSocket extends WebSocket {
    userId: string;
}

export interface Message {
    type?: "connect" | "disconnect" | "chat-message";
    id: string;
    userId: string;
    to: string;
    content: string;
}

// export interface ClientToServerMessage {
//     type: "connect" | "disconnect" | "chat-message"
//     from: string;
//     to: string;
//     content: string;
//     userId: string;
// }

// export interface ServerToClientMessage {
//     id: string;
//     sendBy?: string;
//     sendTo?: string;
//     content: string;
// }
