import { NavActiveConnection } from "@/components/nav_menu/active_connection"
import { NavHome } from "@/components/nav_menu/home"
import { NavTable } from "@/components/nav_menu/table"
import { ConnectionContext } from "@/context/connection"
import { NotificationContext } from "@/context/notification"
import { TableContext } from "@/context/table"
import { getTableService } from "@/service/get_table"
import { tableMetadataService } from "@/service/table_metadata"
import { IconTableFilled } from "@tabler/icons-react"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"

export const Navigation = () => {
    const { connection } = useContext(ConnectionContext)
    const { setTable, table } = useContext(TableContext)
    const [listTable, setListTable] = useState<Array<string>>([])
    const [showSubmenu, setShowSubmenu] = useState(false)
    const { setNotification } = useContext(NotificationContext)
    const router = useRouter()
    const [activeMenu, setActiveMenu] = useState("")

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
            tableMetadataService({ connection_id: connection.id, table: table })
                .then((res) => {
                    setTable({ name: table, pk_column: res.data.indexes[0].column_name })
                    setActiveMenu("table")
                }).catch((err) => {
                    let error = err as Error
                    setNotification({ message: error.message, type: "error" })
                })
        }
    }

    const handleClickTable = () => {
        setActiveMenu("table")
        setShowSubmenu(!showSubmenu)
    }

    const handleClickHome = () => {
        router.push("/")
    }

    const handleClickConnection = () => {
        setActiveMenu("connection")
    }

    return (
        <div className="lg:block bg-secondary fixed z-20 inset-0 right-auto w-[19.5rem] overflow-y-auto overflow-x-hidden">
            <nav className="relative w-full bg-secondary">
                <div className="sticky top-0 bg-secondary">
                    <NavHome onClick={handleClickHome} />
                    {activeMenu == "table" ? <div className="text-green"> <NavTable onClick={handleClickTable} active={true}/> </div> : <NavTable onClick={handleClickTable} active={false}/>}
                </div>
                <div className="w-full bg-primary">
                    {
                        showSubmenu ? (
                            < div className="py-4">
                                {
                                    listTable.map((value, index) =>
                                        value == table?.name ? <div key={index}>
                                            <button className="flex flex-row py-2 w-full ml-4" onClick={() => setActiveTable(value)}>
                                                <IconTableFilled size={12} className="self-center text-yellow" />
                                                <div className="self-center ml-2 text-sm text-green">{value}</div>
                                            </button>
                                        </div> : <div key={index}>
                                            <button className="flex flex-row py-2 ml-4 w-full" onClick={() => setActiveTable(value)}>
                                                <IconTableFilled size={12} className="self-center text-purple" />
                                                <div className="self-center ml-2 text-sm">{value}</div>
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                        ) : null
                    }
                </div>
                <div className="sticky bottom-0 bg-secondary" onClick={handleClickConnection}>
                    <NavActiveConnection />
                </div>
            </nav>
        </div>
    )
}