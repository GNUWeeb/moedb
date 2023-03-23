import axios from "axios"

export type Connection = {
    id: number
    name: string,
    driver: string
    database: string
    host: string
    port: number
    username: String
    password: String
}

export async function getConnectionService() {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/connection`
    try {
        const { data } = await axios.get(url)
        return Promise.resolve(data)
    } catch (err) {
        return Promise.reject(err)
    }
}