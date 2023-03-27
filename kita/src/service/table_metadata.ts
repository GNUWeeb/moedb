import axios, { AxiosError } from "axios"

export async function tableMetadataService(p :{ connection_id: number, table: string }) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/table/metadata`, p)
        return Promise.resolve(data)
    } catch (err) {
        let error = err as AxiosError
        return Promise.reject(error.response?.data)
    }
}

