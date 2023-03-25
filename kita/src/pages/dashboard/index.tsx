import { ConnectionContext } from "@/context/connection"
import { Navigation } from "@/layout/navigation"
import { IconEditCircle, IconSettings2, IconSql, IconSquareRoundedX, IconTerminal, IconTerminal2 } from "@tabler/icons-react"
import React, { useContext, useEffect, useRef, useState } from "react"
import selectService from "@/service/select"
import { TableContext } from "@/context/table"
import MonacoEditor, { useMonaco } from "@monaco-editor/react";
import { editor } from "monaco-editor"
import { OneDark } from "@/etc/monaco-theme"
import { NotificationContext } from "@/context/notification"
import { runQueryService } from "@/service/query"
import Image from 'next/image'

export default function ConnectionIndex() {
    const { connection } = useContext(ConnectionContext)
    const { table, setTable } = useContext(TableContext)
    const { setNotification } = useContext(NotificationContext)
    const [rows, setRows] = useState<{
        values: [],
        columns: []
    }>()
    const [query, setQuery] = useState<string | undefined>("")
    const monaco = useMonaco();
    const [showEditor, setShowEditor] = useState(false)

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

    const [selectedData, setSelectData] = useState<number>()
    const handleR = (x: number) => {
        setSelectData(x)
    }

    useEffect(() => {
        getData()
    }, [table])

    useEffect(() => {
        if (monaco != null) {
            monaco.editor.defineTheme('onedark', OneDark as editor.IStandaloneThemeData)
        }
    }, [monaco])

    const valueGetter = useRef();

    function handleEditorDidMount(_valueGetter: any) {
        valueGetter.current = _valueGetter.current;
    }

    async function runQuery() {
        if (connection != null) {
            try {
                const { data } = await runQueryService({ connection_id: connection.id, query: query as string })
                setRows(data)
            } catch (err) {
                let error = err as Error
                setNotification({ message: error.message, type: "error" })
            }
        }
    }

    return (
        <div className="bg-primary">
            <div className="pl-[19.5rem] min-h-screen min-w-screen">
                <Navigation />
                <div className="flex flex-col w-full h-screen">
                    <div className="h-full overflow-auto">
                        {
                            rows && connection ? (
                                <div className="m-8 bg-secondary p-8 overflow-y-auto">
                                    <div className="overflow-auto flex bg-secondary w-full">
                                        <table className="border-collapse border w-full">
                                            <ShowColumn data={rows.columns} />
                                            <tbody>
                                                {
                                                    rows.values.map((value, index) => {
                                                        let x = value as Map<string, any>
                                                        return index == selectedData ? <tr key={index} onClick={() => handleR(index)}>
                                                            <ShowData data={x} active={true} columns={rows.columns} />
                                                        </tr> : <tr key={index} onClick={() => handleR(index)}>
                                                            <ShowData data={x} active={false} columns={rows.columns} />
                                                        </tr>
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : <div className="w-full h-full flex flex-col justify-center items-center">
                                <div>
                                    <Image src="/assets/bochi.webp" alt="bochi" width={400} height={400} />
                                </div>

                            </div>

                        }
                    </div>
                    {
                        <div className="bg-dark-secondary inset-0 justify-end">
                            {
                                monaco && showEditor && <>
                                    <MonacoEditor
                                        defaultLanguage="sql"
                                        theme="onedark"
                                        height="30vh"
                                        className="font-bold font-editor border  h-full py-4"
                                        onMount={handleEditorDidMount}
                                        onChange={(e) => setQuery(e)}
                                    />
                                    <button className="p-4" onClick={() => runQuery()}>
                                        <div className="flex flex-row items-center bg-green px-2 rounded-md text-dark-secondary">
                                            <IconTerminal2 size={18} />
                                            <span className="ml-2">run</span>
                                        </div>
                                    </button>
                                    <button className="p-4" onClick={() => setShowEditor(false)}>
                                        <div className="flex flex-row items-center bg-red px-2 rounded-md text-dark-secondary">
                                            <IconSquareRoundedX size={18} />
                                            <span className="ml-2">close</span>
                                        </div>
                                    </button>
                                </>
                            }
                            {
                                !showEditor && <>
                                    <button className="p-4" onClick={() => setShowEditor(true)}>
                                        <div className="flex flex-row items-center bg-green px-2 rounded-md text-dark-secondary">
                                            <IconTerminal size={18} />
                                            <span className="ml-2">new query</span>
                                        </div>
                                    </button>
                                </>
                            }

                        </div>
                    }
                </div>
            </div>
        </div >
    )
}


export const ShowData: React.FC<{ data: any, columns: Array<string>, active: boolean }> = ({ data, columns, active }) => {
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
            !active ? columns.map(
                (value, index) =>
                    <td className="truncate border text-center text-sm overflow-hidden w-4 max-w-sm px-2 py-1" key={index} >
                        {data[value]}
                    </td>
            ) : columns.map(
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