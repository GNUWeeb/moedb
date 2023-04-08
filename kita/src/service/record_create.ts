import axios, { AxiosError } from "axios"

export async function createRecordService(p: {
    connection_id: number,
    table: string,
    data: any
}) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/data/batch/insert`
    try {
        const { data } = await axios.post(url, p)
        return Promise.resolve(data)
    } catch (err) {
        let error = err as AxiosError
        return Promise.reject(error.response?.data)
    }
}