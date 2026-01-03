import { queryOptions } from "@tanstack/react-query";
import axios from "axios";
import type { Message } from "../types/message";

const BASE_URL = import.meta.env.VITE_BASE_URL


export function createMessagesQueryOptions(userId: string) {
    return queryOptions({
        queryKey: ["message"],
        queryFn: () => getMessages(userId),
    });
}


async function getMessages(userId: string): Promise<Message[]>{
    try {
        const res =await axios.get(`${BASE_URL}/api/v1/user/messages?userId=${userId}`)
        return res.data.data
    } catch (error) {
        console.log("Message GET Error :: ", error)
        throw error
    }
}