import axios, { AxiosError } from "axios"

export async function deleteConnectionService(id: number) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/connection/${id}`
    try {
        const { data } = await axios.delete(url)
        return Promise.resolve(data)
    } catch (err) {
        let error = err as AxiosError
        return Promise.reject(error.response?.data)
    }
}