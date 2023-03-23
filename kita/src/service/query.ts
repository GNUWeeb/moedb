import axios from "axios"
import { Query } from "@/type/query"

export async function runQueryService(query: Query) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/query`
    try {
        const { data } = await axios.post(url, query)
        return Promise.resolve(data)
    } catch (err) {
        return Promise.reject(err)
    }
}