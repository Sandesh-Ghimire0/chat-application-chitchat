import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL

export async function fetchFriends(userId: string){
    try {
        const res =await axios.get(`${BASE_URL}/api/v1/user/friends?userId=${userId}`)
        return res.data.data
    } catch (error) {
        console.log("Friend GET Error :: ", error)
    }
}

export async function getMessages(userId: string){
    try {
        const res =await axios.get(`${BASE_URL}/api/v1/user/messages?userId=${userId}`)
        return res.data.data
    } catch (error) {
        console.log("Message GET Error :: ", error)
    }
}

