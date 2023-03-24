import axios, { AxiosError } from "axios"

export async function getTableService(connectionID: number) {
    try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/table/${connectionID}`)
        return Promise.resolve(data)
    } catch (err) {
        let error = err as AxiosError
        return Promise.reject(error.response?.data)
    }
}