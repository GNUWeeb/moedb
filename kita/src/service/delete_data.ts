import axios, { AxiosError } from "axios"

export type DeleteDataPayload = {
    connection_id: number,
    table: string,
    id: any,
}

export async function deleteDataService(p: DeleteDataPayload) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/data/delete`, p)
        return Promise.resolve(data)
    } catch (err) {
        let error = err as AxiosError
        return Promise.reject(error.response?.data)
    }
}