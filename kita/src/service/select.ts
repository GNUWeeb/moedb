import axios, { AxiosError } from "axios"

export default async function selectService(p: {
    table: string,
    connection_id: number,
    limit: number,
    page: number,
    search: string,
    order_by: string,
    order_type: string,
}) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/data/list`, p)
        return Promise.resolve(data)
    } catch (err) {
        let error = err as AxiosError
        return Promise.reject(error.response?.data)
    }
}