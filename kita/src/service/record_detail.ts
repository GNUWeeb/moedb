import axios, { AxiosError } from "axios"

export async function getDetailRecordService(p: {
    connection_id: number,
    table: string,
    id: any
}) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/data/detail`
    try {
        const { data } = await axios.post(url, p)
        return Promise.resolve(data)
    } catch (err) {
        let error = err as AxiosError
        return Promise.reject(error.response?.data)
    }
}