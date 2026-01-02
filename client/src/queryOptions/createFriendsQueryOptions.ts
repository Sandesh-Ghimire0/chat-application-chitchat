import { queryOptions } from "@tanstack/react-query";
import axios from "axios";
import type { Friend } from "../types/client";

const BASE_URL = import.meta.env.VITE_BASE_URL

export function createFriendsQueryOptions() {
    return queryOptions({
        queryKey: ["friends"],
        queryFn: () => getFriends('user-1'),
    });
}


async function getFriends(userId: string): Promise<Friend[]> {
    try {
        const res =await axios.get(`${BASE_URL}/api/v1/user/friends?userId=${userId}`)
        return res.data.data
    } catch (error) {
        console.log("Friend GET Error :: ", error)
        throw error
    }
}