export interface User {
    id: string;
    username: string;
    email: string;
    image: string;
    token?:string
}

export interface LoginUser {
    email:string,
    password: string
}

export interface Friend {
    id: string;
    username: string;
    isActive: boolean;
    image: string;
}
