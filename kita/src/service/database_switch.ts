import axios, { AxiosError } from "axios"

export async function switchDatabaseService(p: { connection_id: number, db_name: string }) {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/database/switch`
        const { data } = await axios.post(url, p)
        return Promise.resolve(data)
    } catch (err) {
        let error = err as AxiosError
        return Promise.reject(error.response?.data)
    }
}