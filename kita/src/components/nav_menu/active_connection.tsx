import { ConnectionContext } from "@/context/connection"
import { IconPlug, IconPlugConnected, IconPlugConnectedX, IconPlugX, IconServer } from "@tabler/icons-react"
import { useContext } from "react"

export const NavActiveConnection = () => {
    const { connection } = useContext(ConnectionContext)
    if (connection == null) {
        return <button className="w-full flex flex-row">
            <div className="p-4" >
                <IconPlugX />
            </div>
            <div className="self-center w-full flex flex-row">Connection</div>
        </button>
    } else {
        return (
            <button className="w-full flex flex-row">
                <div className="p-4" >
                    <IconPlugX />
                </div>
                <div className="self-center w-full flex flex-row">{connection.name}</div>
            </button>

        )
    }
}