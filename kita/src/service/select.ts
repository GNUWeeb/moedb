import axios, { AxiosError } from "axios"

export default async function selectService(table: string, connID: number) {
    try {
        const req = {
            table: table,
            connection_id: connID
        }
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/data/list`, req)
        return Promise.resolve(data)
    } catch (err) {
        let error = err as AxiosError
        return Promise.reject(error.response?.data)
    }
}