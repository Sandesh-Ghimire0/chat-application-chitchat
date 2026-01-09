import { queryOptions } from "@tanstack/react-query";
import axios from "axios";
import type { Friend } from "../types/type";

const BASE_URL = import.meta.env.VITE_BASE_URL


export function createFriendsQueryOptions(userId: string) {
    return queryOptions({
        queryKey: ["friends"],
        queryFn: () => getFriends(userId),
    });
}


async function getFriends(userId: string): Promise<Friend[]> {
    const token = JSON.parse(sessionStorage.getItem("token") as string);

    try {
        const res =await axios.get(`${BASE_URL}/api/v1/user/friends?userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return res.data.data
    } catch (error) {
        console.log("Friend GET Error :: ", error)
        throw error
    }
}