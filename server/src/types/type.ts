import WebSocket from "ws";

export interface ClientSocket extends WebSocket {
    userId: string;
}

// export interface Message {
//     type?: "connect" | "disconnect" | "chat-message";
//     id: string;
//     from: string;
//     to: string;
//     content: string;
// }

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
}

export type Message = ConnectUserMessage | DisconnectUserMessage | ChatMessage;

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
