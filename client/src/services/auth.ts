import axios from "axios";
import type { User } from "../types/type";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function loginUser(user: {
    email: string;
    password: string;
}): Promise<User> {
    try {
        const res = await axios.post(`${BASE_URL}/api/v1/auth/login`, user);
        return res.data.data;
    } catch (error) {
        console.log("User Login Error :: ", error);
        throw error;
    }
}

export async function signupUser(user: {
    username: string;
    email: string;
    password: string;
}): Promise<User> {
    try {
        const res = await axios.post(`${BASE_URL}/api/v1/auth/signup`, user);
        return res.data.data;
    } catch (error) {
        console.log("User Login Error :: ", error);
        throw error;
    }
}
