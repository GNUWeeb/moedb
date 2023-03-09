import { IconServer } from "@tabler/icons-react"
import Link from "next/link"

export const NavConnection = () => {
    return (
        <button className="w-full flex flex-row">
            <div className="p-4" >
                <IconServer />
            </div>
            <div className="ml-4 self-center" >Connection</div>
        </button>
    )
}