import axios, { AxiosError } from "axios"
import { Query } from "@/type/query"

export async function runQueryService(query: Query) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/raw-query`
    try {
        const { data } = await axios.post(url, query)
        return Promise.resolve(data)
    } catch (err) {
        let error = err as AxiosError
        return Promise.reject(error.response?.data)
    }
}