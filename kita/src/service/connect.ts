import axios, { AxiosError } from "axios"

export async function connectService(connectionID: number) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/connection/${connectionID}/connect`
    try {
        const { data } = await axios.get(url)
        return Promise.resolve(data)
    } catch (err) {
        let error = err as AxiosError
        return Promise.reject(error.response?.data)
    }
}