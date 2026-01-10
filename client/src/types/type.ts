export interface LoginUser {
    email: string;
    password: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    image: string;
    token?: string;
}

export interface Friend {
    id: string;
    username: string;
    isOnline: boolean;
    image: string;
}

export interface ConnectUserMessage {
    type: "connect";
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
    id?: string; // added in backend
    from: string;
    to: string;
    content: string;
}

export type Message = ActiveUserMessage | DeactiveUserMessage | ChatMessage;
