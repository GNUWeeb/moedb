import { IconHome } from "@tabler/icons-react"
import Link from "next/link"
import { useRouter } from "next/router"

export const NavHome = () => {

    const router = useRouter()

    const handleClick = () => {
        router.push("/")
    }

    return (
        <button className="w-full flex flex-row" onClick={() => handleClick()}>
            <div className="p-4" >
                <IconHome />
            </div>
            <div className="self-center w-full flex flex-row">Home</div>
        </button>
    )
}