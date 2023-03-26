import axios, { AxiosError } from "axios"

export async function batchDeleteService(p: {
    id: Array<number>,
    table: string,
    connection_id: number
}) {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/data/batch/delete`
        const { data } = await axios.post(url, p)
        return Promise.resolve(data)
    } catch (err) {
        let error = err as AxiosError
        return Promise.reject(error.response?.data)
    }
}