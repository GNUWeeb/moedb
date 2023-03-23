import { ConnectionContext } from "@/context/connection"
import { Navigation } from "@/layout/navigation"
import { IconEditCircle, IconSettings2 } from "@tabler/icons-react"
import React, { useContext, useEffect, useState } from "react"
import selectService from "@/service/select"
import { TableContext } from "@/context/table"
import { getTableService } from "@/service/get_table"
import MonacoEditor, { useMonaco } from "@monaco-editor/react";
import { editor } from "monaco-editor"
import { OneDark } from "@/etc/monaco-theme"
import { NotificationContext } from "@/context/notification"

export default function ConnectionIndex() {
    const { connection } = useContext(ConnectionContext)
    const { table, setTable } = useContext(TableContext)
    const { setNotification } = useContext(NotificationContext)
    const [rows, setRows] = useState<{
        values: [],
        columns: []
    }>()
    const monaco = useMonaco();

    const getData = async () => {
        if (connection != null && table != null) {
            try {
                const { data } = await selectService(table, connection.id)
                setRows(data)
            } catch (err) {
                let error = err as Error
                setNotification({ message: error.message, type: "error" })
            }
        }
    }


    const getTable = async () => {
        if (connection != null && table != null) {
            try {
                const { data } = await getTableService(connection.id)
                setTable(data)
            } catch (err) {
                let error = err as Error
                setNotification({ message: error.message, type: "error" })
            }
        }
    }

    const [selectedData, setSelectData] = useState<number>()
    const handleR = (x: number) => {
        setSelectData(x)
    }

    useEffect(() => {
        getTable()
        monaco?.editor.defineTheme('onedark', OneDark as editor.IStandaloneThemeData)
    }, [])

    useEffect(() => {
        getData()
    }, [table])

    useEffect(() => {
        if (monaco != null) {
            monaco.editor.defineTheme('onedark', OneDark as editor.IStandaloneThemeData)
        }
    }, [monaco])

    return (
        <div className="bg-primary">
            <div className="pl-[19.5rem] min-h-screen min-w-screen">
                <Navigation />
                <div className="flex flex-col w-full h-screen">
                    <div className="h-3/4 overflow-auto">
                        {
                            rows && connection && (
                                <div className="m-8 rounded-2xl bg-secondary p-8 overflow-y-auto">
                                    <div className="overflow-auto flex bg-secondary w-full">
                                        <table className="border-collapse border w-full">
                                            <ShowColumn data={rows.columns} />
                                            <tbody>
                                                {
                                                    rows.values.map((value, index) => {
                                                        let x = value as Map<string, any>
                                                        return index == selectedData ? <tr key={index} onClick={() => handleR(index)}>
                                                            <ShowData data={x} active={true} />
                                                        </tr> : <tr key={index} onClick={() => handleR(index)}>
                                                            <ShowData data={x} active={false} />
                                                        </tr>
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    {monaco && <MonacoEditor
                        defaultLanguage="sql"
                        theme="onedark"
                        height="25vh"
                        className="font-bold font-editor border h-full"
                    />
                    }
                </div>
            </div>
        </div >
    )
}


export const ShowData: React.FC<{ data: any, active: boolean }> = ({ data, active }) => {
    let keys = []
    for (let key in data) {
        keys.push(key)
    }

    return <>
        {
            active ? <td className="border text-center text-sm bg-dark-secondary">
                <button>
                    <IconEditCircle size={16} className="text-yellow" />
                </button>
            </td> : <td className="border text-center text-sm bg-dark-secondary">
                <button>
                    <IconEditCircle size={16} className="text-purple" />
                </button>
            </td>
        }
        {
            !active ? keys.map(
                (value, index) =>
                    <td className="truncate border text-center text-sm overflow-hidden w-4 max-w-sm px-2 py-1" key={index} >
                        {data[value]}
                    </td>
            ) : keys.map(
                (value, index) =>
                    <td className="truncate border text-center text-sm overflow-hidden w-4 max-w-sm px-2 text-green py-1" key={index} >
                        {data[value]}
                    </td>
            )

        }
    </>
}


export const ShowColumn: React.FC<{ data: Array<string> }> = ({ data }) => {
    return (
        <thead>
            <tr>
                <th className="text-center text-dark-secondary bg-blue w-0 px-3">
                    <button className="align-middle">
                        <IconSettings2 size={18} />
                    </button>
                </th>
                {
                    data.map((value, index) => {
                        return <th className="border text-dark-secondary p-2 bg-blue" key={index}>{value}</th>
                    })
                }
            </tr>
        </thead>
    )
}