import axios from "axios"
import { Connection } from "@/type/connection"

export async function createConnectionService(conn: Connection) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/connection`
    try {
        const { data } = await axios.post(url, conn)
        return Promise.resolve(data)
    } catch (err) {
        return Promise.reject(err)
    }
}