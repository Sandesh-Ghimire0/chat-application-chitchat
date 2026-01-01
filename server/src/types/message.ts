export interface ClientToServerMessage {
    from: string;
    to: string;
    message: string;
}

export interface ServerToClientMessage {
    type: "client-id" | "all-clients" | "chat-message";
    clientId?: string;
    allClients?: { clientId: string; username: string }[];
    sendBy?: string;
    sendTo?: string;
    message?: string;
}
