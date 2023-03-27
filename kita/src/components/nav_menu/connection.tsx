import { IconServer } from "@tabler/icons-react"

export const NavConnection = () => {
    return (
        <button className="w-full flex flex-row">
            <div className="p-4 bg-red text-dark-secondary" >
            <IconServer />
            </div>
            <div className="ml-6 self-center" >Connection</div>
        </button>
    )
}