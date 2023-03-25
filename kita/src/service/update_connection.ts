import axios, { AxiosError } from "axios"
import { Connection } from "@/type/connection"

export async function updateConnectionService(conn: Connection) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/connection/update`
    try {
        const { data } = await axios.put(url, conn)
        return Promise.resolve(data)
    } catch (err) {
        let error = err as AxiosError
        return Promise.reject(error.response?.data)
    }
}