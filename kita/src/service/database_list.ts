import axios, { AxiosError } from "axios"

export async function getListDatabaseService(connectionID: number) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/database/list`, { connection_id: connectionID })
        return Promise.resolve(data)
    } catch (err) {
        let error = err as AxiosError
        return Promise.reject(error.response?.data)
    }
}