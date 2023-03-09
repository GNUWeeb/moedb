import axios from "axios"

export async function connectService(connectionID: number) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/connection/${connectionID}/connect`
    try {
        const { data } = await axios.get(url)
        return Promise.resolve(data)
    } catch (err) {
        console.log(err)
        Promise.reject(err)
    }
}