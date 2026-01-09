import axios from "axios";
import type { User } from "../types/type";
import { queryOptions } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export function createUserQueryOptions() {
    return queryOptions({
        queryKey: ["authUser"],
        queryFn: fetchCurrentUser,
    });
}

async function fetchCurrentUser(): Promise<User> {
    const token = JSON.parse(sessionStorage.getItem("token") as string);

    try {
        const res = await axios.get(`${BASE_URL}/api/v1/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data.data;
    } catch (error) {
        console.log("Error when fetching current user ", error);
        throw error;
    }
}
