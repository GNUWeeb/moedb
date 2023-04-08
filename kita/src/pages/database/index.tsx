'use client';

import React, { useContext, useEffect, useState } from "react"
import { activeDatabaseAtom, activeTableAtom, PrimaryNavigation } from "@/components/side_nav/primary"
import { DatabaseNavigation } from "@/components/side_nav/database";
import { useAtom } from "jotai";
import { IconPlus, IconRefresh } from "@tabler/icons-react";
import { TableRowBody } from "@/components/table_row_body";
import { TableHead } from "@/components/table_head";
import { getTableService } from "@/service/get_table";
import { ConnectionContext } from "@/context/connection";
import { switchDatabaseService } from "@/service/database_switch";
import { NotificationContext } from "@/context/notification";

export default function Database() {

    const { setNotification } = useContext(NotificationContext)
    const [activeDb] = useAtom(activeDatabaseAtom)
    const [, setActiveTable] = useAtom(activeTableAtom)
    const [checkBoxList, setCheckBoxList] = useState<Array<boolean>>([])
    const [checkedAll, setCheckedAll] = useState(false)
    const [listTable, setListTable] = useState<Array<any>>([])
    const { connection } = useContext(ConnectionContext)

    const handleCheckList = (x: number) => {
        let checkList = checkBoxList
        checkList[x] = !checkList[x]
        setCheckBoxList([...checkList])
    }

    const checkAll = () => {
        let checkboxes = new Array(listTable.values.length).fill(!checkedAll)
        setCheckBoxList([...checkboxes])
        setCheckedAll(!checkedAll)
    }

    useEffect(() => {
        const getListTable = async () => {
            try {
                const { data } = await getTableService(connection!.id)
                let res: Array<any> = []
                data.forEach((value: any) => {
                    let x: any = {}
                    x["table"] = value
                    res.push(XSLTProcessor)
                })
                setListTable(res)
                setActiveTable("")
            } catch (err) {
                let error = err as Error
                setNotification({ message: error.message, type: "error" })
            }
        }
        getListTable()
    }, [connection, setNotification, setActiveTable])

    useEffect(() => {
        const handleSwitchDB = async () => {
            try {
                await switchDatabaseService({
                    connection_id: connection!.id,
                    db_name: activeDb,
                })
                const { data } = await getTableService(connection!.id)
                let res: Array<any> = []
                data.forEach((value: any) => {
                    let x: any = {}
                    x["table"] = value
                    res.push(x)
                })
                setListTable(res)
            } catch (err) {
                let error = err as Error
                setNotification({ message: error.message, type: "error" })
            }
        }
        handleSwitchDB()
    }, [activeDb, connection, setNotification])

    return <div className="min-w-screen min-h-screen flex flex-row">
        <PrimaryNavigation />
        <DatabaseNavigation />

        <div className="flex flex-col w-full h-screen">
            <div className="h-full overflow-auto">
                <div className="bg-secondary h-full overflow-y-auto border-l-2 ">
                    <div className="m-8 flex flex-row justify-between items-center">
                        <div className="flex flex-row items-center text-lg">
                            <span className="font-bold text-gray-primary">Databases</span>
                            <span className="mx-2">/</span>
                            <span className="font-bold">{activeDb}</span>
                            <button>
                                <IconRefresh className="ml-4 font-bold" size={20} />
                            </button>
                        </div>
                        <div className="flex flex-row space-x-4">
                            <button
                                className="bg-dark-primary p-2 text-white flex flex-row"
                            >
                                <IconPlus />
                                <span className="mx-2">
                                    New Database
                                </span>
                            </button>
                            <button
                                className="bg-dark-primary p-2 text-white flex flex-row"
                            >
                                <IconPlus />
                                <span className="mx-2">
                                    New Table
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="overflow-auto flex bg-secondary w-full mt-4">
                        <table className="border-collapse w-full px-24">
                            <thead className="px-24">
                                <TableHead
                                    data={["table"]}
                                    checkbox={checkAll}
                                />
                            </thead>
                            <tbody>
                                <TableRowBody
                                    checkList={checkBoxList}
                                    checkListFunc={handleCheckList}
                                    columns={["table"]}
                                    data={listTable}
                                    detailFunc={() => { }}
                                />
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div >
}