import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL

export async function getFriends(userId: string){
    try {
        const res =await axios.get(`${BASE_URL}/api/v1/user/friends?userId=${userId}`)
        return res
    } catch (error) {
        console.log("User GET Error :: ", error)
    }
}

