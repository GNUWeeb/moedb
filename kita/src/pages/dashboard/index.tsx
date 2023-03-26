import { ConnectionContext } from "@/context/connection"
import { Navigation } from "@/layout/navigation"
import { IconCheckbox, IconEditCircle, IconSettings2, IconSql, IconSquare, IconSquareCheck, IconSquareRoundedX, IconTerminal, IconTerminal2, IconTrash, IconTrashX } from "@tabler/icons-react"
import React, { useContext, useEffect, useRef, useState } from "react"
import selectService from "@/service/select"
import { TableContext } from "@/context/table"
import MonacoEditor, { useMonaco } from "@monaco-editor/react";
import { editor } from "monaco-editor"
import { OneDark } from "@/etc/monaco-theme"
import { NotificationContext } from "@/context/notification"
import { runQueryService } from "@/service/query"
import Image from 'next/image'
import { DeleteDataPayload, deleteDataService } from "@/service/delete_data"
import { useGetData } from "@/hooks/use_get_data"
import { batchDeleteService } from "@/service/batch_delete"

export default function ConnectionIndex() {
    const { connection } = useContext(ConnectionContext)
    const { setNotification } = useContext(NotificationContext)
    const { rows, setRows } = useGetData()
    const [query, setQuery] = useState<string | undefined>("")
    const monaco = useMonaco();
    const [showEditor, setShowEditor] = useState(false)
    const { table } = useContext(TableContext)
    const [reload, setReload] = useState(false)
    const [checkBoxList, setCheckBoxList] = useState<Array<Boolean>>([])
    const [checkedAll, setCheckedAll] = useState(false)

    const deleteData = async (p: DeleteDataPayload) => {
        try {
            await deleteDataService(p)
            setNotification({ message: "delete row success", type: "success" })
            setReload(!reload)
        } catch (err) {
            let error = err as Error
            setNotification({ message: error.message, type: "error" })
        }
    }

    const handleR = (x: number) => {
        let box = checkBoxList
        box[x] = !box[x]
        setCheckBoxList([...box])
    }

    const checkAll = () => {
        let checkboxes = new Array(rows?.values.length).fill(!checkedAll)
        setCheckBoxList([...checkboxes])
        setCheckedAll(!checkedAll)
    }

    useEffect(() => {
        if (monaco != null) {
            monaco.editor.defineTheme('onedark', OneDark as editor.IStandaloneThemeData)
        }
    }, [monaco])

    useEffect(() => {
        if (connection !== null && table != null) {
            selectService(table, connection.id)
                .then(({ data }) => {
                    setRows(data)
                })
                .catch((err) => {
                    let error = err as Error
                    setNotification({ message: error.message, type: "error" })
                })
        }
    }, [reload])

    useEffect(() => {
        const box: Array<boolean> = new Array(rows?.values.length)
        box.fill(false)
        setCheckBoxList(box)
    }, [rows])

    const valueGetter = useRef();
    function handleEditorDidMount(_valueGetter: any) {
        valueGetter.current = _valueGetter.current;
    }

    async function runQuery() {
        if (connection != null) {
            try {
                const { data } = await runQueryService({ connection_id: connection.id, query: query as string })
                if (data.op === "query") {
                    setRows(data)
                } else {
                    setReload(!reload)
                }
            } catch (err) {
                let error = err as Error
                setNotification({ message: error.message, type: "error" })
            }
        }
    }

    const batchDelete = async () => {
        try {
            const id: Array<number> = []
            checkBoxList.forEach((value, index) => {
                if (value) {
                    id.push(rows!.values[index]["id"])
                }
            })

            await batchDeleteService({
                connection_id: connection?.id!,
                id: id,
                table: table!,
            })
            setNotification({ message: "delete rows success", type: "success" })
            setReload(!reload)
        } catch (err) {
            let error = err as Error
            setNotification({ message: error.message, type: "error" })
        }
    }


    if (connection === undefined || rows === undefined || table === undefined) {
        return <div className="bg-primary">
            <div className="pl-[19.5rem] min-h-screen min-w-screen">
                <Navigation />
                <div className="flex flex-col w-full h-screen">
                    <div className="h-full overflow-auto">
                        <div className="w-full h-full flex flex-col justify-center items-center">
                            <div>
                                <Image src="/assets/bochi.webp" alt="bochi" width={400} height={400} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    return (
        <div className="bg-primary">
            <div className="pl-[19.5rem] min-h-screen min-w-screen">
                <Navigation />
                <div className="flex flex-col w-full h-screen">
                    <div className="h-full overflow-auto">
                        <div className="m-8 bg-secondary p-8 overflow-y-auto">
                            <div className="overflow-auto flex bg-secondary w-full">
                                <table className="border-collapse border w-full">
                                    <ShowColumn data={rows.columns} checkbox={checkAll} />
                                    <tbody>
                                        {
                                            rows.values.map((value, index) => {
                                                let x = value as Map<string, any>
                                                return (
                                                    <>
                                                        <tr key={index} onClick={() => handleR(index)}>
                                                            <td className="border text-center text-sm bg-dark-secondary">
                                                                <button>
                                                                    <IconEditCircle size={16} className="text-purple" />
                                                                </button>
                                                            </td>
                                                            <td className="border text-center text-sm bg-dark-secondary">
                                                                <button onClick={() => deleteData({
                                                                    connection_id: connection!.id!,
                                                                    id: value["id"],
                                                                    table: table!,
                                                                })}>
                                                                    <IconTrash size={16} className="text-red" />
                                                                </button>
                                                            </td>
                                                            <td className="border text-center text-sm bg-dark-secondary">
                                                                <button>
                                                                    {
                                                                        checkBoxList[index] ?
                                                                            <IconSquareCheck size={16} className="text-yellow" onClick={() => handleR(index)} />
                                                                            : <IconSquare size={16} className="text-white" onClick={() => handleR(index)} />
                                                                    }
                                                                </button>
                                                            </td>
                                                            {
                                                                checkBoxList[index] ?
                                                                    <ShowData data={x} active={true} columns={rows.columns} />
                                                                    :
                                                                    <ShowData data={x} active={false} columns={rows.columns} />
                                                            }
                                                        </tr>
                                                    </>
                                                )
                                            }
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {
                        <div className="bg-dark-secondary inset-0 justify-end">
                            <div className="flex flex-row justify-between">
                                <div>
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
                                {
                                    checkBoxList.filter((value, index) => value == true).length > 0 && <>
                                        <button className="p-4" onClick={() => batchDelete()}>
                                            <div className="flex flex-row items-center bg-red px-2 rounded-md text-dark-secondary">
                                                <IconTerminal size={18} />
                                                <span className="ml-2">delete</span>
                                            </div>
                                        </button>
                                    </>
                                }
                            </div>
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


export const ShowColumn: React.FC<{ data: Array<string>, checkbox: () => void }> = ({ data, checkbox }) => {
    return (
        <thead>
            <tr>
                <th className="text-center border text-dark-secondary bg-blue w-0 px-1">
                    <button className="align-middle">
                        <IconSettings2 size={18} />
                    </button>
                </th>
                <th className="text-center border text-dark-secondary bg-blue w-0 px-1">
                    <button className="align-middle">
                        <IconTrashX size={18} />
                    </button>
                </th>
                <th className="text-center border text-dark-secondary bg-blue w-0 px-1">
                    <button className="align-middle" onClick={checkbox}>
                        <IconCheckbox size={18} />
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