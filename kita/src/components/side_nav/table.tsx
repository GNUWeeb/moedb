import { IconTableFilled } from "@tabler/icons-react"
import { atom, useAtom } from "jotai"
import { useEffect, useState } from "react"
import { activeTableAtom, listTableAtom } from "./primary"

export const TableNavigation: React.FC<{}> = ({ }) => {
    const [activeTable, setActiveTable] = useAtom(activeTableAtom)
    const handleSetActiveMenu = (table: string) => {
        setActiveTable(table)
    }
    const [table] = useAtom(listTableAtom)
    const [items, setItems] = useState<Array<string>>([])

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