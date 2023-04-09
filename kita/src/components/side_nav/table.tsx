import { ConnectionContext } from "@/context/connection"
import { NotificationContext } from "@/context/notification"
import { switchDatabaseService } from "@/service/database_switch"
import { getTableService } from "@/service/get_table"
import { IconTableFilled } from "@tabler/icons-react"
import { atom, useAtom } from "jotai"
import { useContext, useEffect, useState } from "react"
import { activeDatabaseAtom, activeTableAtom, listTableAtom } from "./primary"

export const TableNavigation: React.FC<{}> = ({ }) => {
    const [activeTable, setActiveTable] = useAtom(activeTableAtom)
    const { setNotification } = useContext(NotificationContext)
    const { connection } = useContext(ConnectionContext)
    const handleSetActiveMenu = (table: string) => {
        setActiveTable(table)
    }
    const [table, setListTable] = useAtom(listTableAtom)
    const [items, setItems] = useState<Array<string>>([])
    const [activeDB] = useAtom(activeDatabaseAtom)

    const getTable = async () => {
        try {
            if (connection != null) {
                const { data } = await getTableService(connection.id)
                setListTable(data)
            }
        } catch (err) {
            let error = err as Error
            setNotification({ message: error.message, type: "error" })
        }
    }

    useEffect(() => {
        setItems(table)
    }, [table])

    const searchTable = (e: string) => {
        const newItems = items.filter((value) => value.includes(e))
        if (e !== "") {
            setItems(newItems)
        } else {
            setItems(table)
        }
    }

    useEffect(() => {
        const switchDB = async () => {
            try {
                await switchDatabaseService({
                    connection_id: connection!.id,
                    db_name: activeDB,
                })
                getTable()
            } catch (err) {
                let error = err as Error
                setNotification({ message: error.message, type: "error" })
            }
        }
        switchDB()
    }, [activeDB])


    return (
        <div className="w-1/8 bg-secondary border-l-2 flex flex-col spcae-y-4">
            <div className="bg-secondary w-full h-20 border-b-2 flex flex-col justify-center items-center">
                <input
                    type="text"
                    className="bg-secondary h-8 px-2 mx-4"
                    placeholder="search table"
                    onChange={(e) => {
                        searchTable(e.target.value)
                    }}
                />
            </div>
            <div className="mt-4">
                {
                    items.map((value, index) =>
                        value === activeTable ?
                            <div className="flex flex-row py-2 mx-2 px-2 bg-primary" key={index}>
                                <button onClick={() => handleSetActiveMenu(value)} className="flex flex-row w-full">
                                    <IconTableFilled size={16} className="self-center" />
                                    <div className="self-center ml-2">{value}</div>
                                </button>
                            </div> : <div key={index} className="flex flex-row py-2 mx-2 px-2 hover:bg-primary" >
                                <button onClick={() => handleSetActiveMenu(value)} className="flex flex-row w-full">
                                    <IconTableFilled size={16} className="self-center" />
                                    <div className="self-center ml-2">{value}</div>
                                </button>
                            </div>
                    )
                }
            </div>

        </div>
    )
}