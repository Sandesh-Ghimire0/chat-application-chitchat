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
    isActive: boolean;
    image: string;
}

export interface Message {
    type: "active-user" | "deactive-user" | "chat-message";
    id?: string;
    userId: string;
    to: string;
    content: string;
    activeUserId?: string;
    deactiveUserId?: string
}
