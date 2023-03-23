import axios from "axios"

export default async function selectService(table: string, connID: number) {
    try {
        const req = {
            table: table,
            connection_id: connID
        }
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/data`, req)
        return Promise.resolve(data)
    } catch (err) {
        return Promise.reject(err)
    }
}