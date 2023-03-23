import { NavActiveConnection } from "@/components/nav_menu/active_connection"
import { NavConnection } from "@/components/nav_menu/connection"
import { NavHome } from "@/components/nav_menu/home"
import { NavTable } from "@/components/nav_menu/table"
import { ConnectionContext } from "@/context/connection"
import { NotificationContext } from "@/context/notification"
import { TableContext } from "@/context/table"
import { getTableService } from "@/service/get_table"
import { IconTableFilled } from "@tabler/icons-react"
import { useContext, useEffect, useState } from "react"

export const Navigation = () => {
    const { connection } = useContext(ConnectionContext)
    const { setTable, table } = useContext(TableContext)
    const [listTable, setListTable] = useState<Array<string>>([])
    const [showSubmenu, setShowSubmenu] = useState(false)
    const { setNotification } = useContext(NotificationContext)

    useEffect(() => {
        if (connection != null) {
            getTableService(connection.id).then(res => {
                setListTable(res.data)
            }).catch(err => {
                let error = err as Error
                setNotification({ message: error.message, type: "error" })
            })
        }
    }, [connection])

    const setActiveTable = (table: string) => {
        if (connection != null) {
            setTable(table)
        }
    }

    const handleClick = () => {
        setShowSubmenu(!showSubmenu)
    }

    return (
        <div className="lg:block bg-secondary fixed z-20 inset-0 right-auto w-[19.5rem] overflow-y-auto overflow-x-hidden">
            <nav className="relative w-full bg-secondary">
                <div className="sticky top-0 bg-secondary">
                    <div>
                        <NavHome />
                    </div>
                    <NavTable onClick={handleClick} />
                </div>
                <div className="w-full bg-primary">
                    {
                        showSubmenu ? (
                            listTable.map((value, index) =>
                                value == table ? <div>
                                    <button className="flex flex-row py-2 ml-8 w-full" onClick={() => setActiveTable(value)}>
                                        <IconTableFilled size={12} className="self-center text-yellow" />
                                        <div key={index} className="self-center ml-2 text-sm text-green">{value}</div>
                                    </button>
                                </div> : <div>
                                    <button className="flex flex-row py-2 ml-8 w-full" onClick={() => setActiveTable(value)}>
                                        <IconTableFilled size={12} className="self-center text-purple" />
                                        <div key={index} className="self-center ml-2 text-sm">{value}</div>
                                    </button>
                                </div>
                            )
                        ) : null
                    }
                </div>
                <div className="sticky bottom-0 bg-secondary">
                    <NavActiveConnection />
                </div>
            </nav>
        </div>
    )
}