import { ConnectionContext } from "@/context/connection"
import { IconPlus, IconRefresh, IconSearch } from "@tabler/icons-react"
import React, { useContext, useEffect, useState } from "react"
import selectService from "@/service/select"
import { NotificationContext } from "@/context/notification"
import { runQueryService } from "@/service/query"
import { batchDeleteService } from "@/service/batch_delete"
import { atom, useAtom } from "jotai"
import { PrimaryNavigation, listTableAtom, activeTableAtom } from "@/components/side_nav/primary"
import { TableNavigation } from "@/components/side_nav/table"
import { orderByAtom, orderTypeAtom, TableHead } from "@/components/table_head";
import { Loading } from "@/components/loading";
import { CreateRecord } from "@/layout/create_record";
import { DetailRecord } from "@/layout/detail_record";
import { Records } from "@/type/records";
import { BottomNav } from "@/components/bottom_nav";
import { queryAtom } from "@/components/editor";
import { TableRowBody } from "@/components/table_row_body"

export default function Table() {
    const { connection } = useContext(ConnectionContext)
    const { setNotification } = useContext(NotificationContext)

    // internal state
    const [rows, setRows] = useState<Records>({ values: [], columns: [], pagination: null })
    const [query] = useAtom(queryAtom)
    const [reload, setReload] = useState(false)
    const [checkBoxList, setCheckBoxList] = useState<Array<boolean>>([])
    const [checkedAll, setCheckedAll] = useState(false)
    const [search, setSearch] = useState("")
    const [showDetail, setShowDetail] = useState<any>("")
    const [showCreate, setShowCreate] = useState(false)

    // shared state
    const [activeTable, setActiveTable] = useAtom(activeTableAtom)
    const [orderType] = useAtom(orderTypeAtom)
    const [orderBy] = useAtom(orderByAtom)

    const handleCheckList = (x: number) => {
        let checkList = checkBoxList
        checkList[x] = !checkList[x]
        setCheckBoxList([...checkList])
    }

    const checkAll = () => {
        let checkboxes = new Array(rows?.values.length).fill(!checkedAll)
        setCheckBoxList([...checkboxes])
        setCheckedAll(!checkedAll)
    }

    const runQuery = async () => {
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
                table: activeTable,
            })
            setNotification({ message: "delete rows success", type: "success" })
            setReload(!reload)
        } catch (err) {
            let error = err as Error
            setNotification({ message: error.message, type: "error" })
        }
    }

    const nextPage = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        try {
            e.preventDefault()
            if (connection !== null && activeTable != null && rows.pagination) {
                const res = await selectService({
                    connection_id: connection.id,
                    limit: rows.pagination.limit,
                    page: rows.pagination.page + 1,
                    order_by: orderBy,
                    order_type: orderType,
                    search: search,
                    table: activeTable,
                })
                setRows({
                    columns: res.data.columns,
                    pagination: res.pagination,
                    values: [...rows.values, ...res.data.values],
                })
            }
        } catch (err) {
            let error = err as Error
            setNotification({ message: error.message, type: "error" })
        }
    }

    const handleSearch = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            if (connection !== null && activeTable != null) {
                const res = await selectService({
                    connection_id: connection.id,
                    limit: 10,
                    page: 1,
                    order_by: orderBy,
                    order_type: orderType,
                    search: search,
                    table: activeTable,
                })
                setRows({
                    columns: res.data.columns,
                    pagination: res.pagination,
                    values: res.data.values,
                })
            }
        } catch (err) {
            let error = err as Error
            setNotification({ message: error.message, type: "error" })
        }
    }

    useEffect(() => {
        if (connection !== null && activeTable !== "") {
            selectService({
                connection_id: connection.id,
                limit: 10,
                page: 1,
                order_by: "",
                order_type: "",
                search: "",
                table: activeTable,
            })
                .then((res) => {
                    setRows({
                        columns: res.data.columns,
                        pagination: res.pagination,
                        values: res.data.values,
                    })
                })
                .catch((err) => {
                    let error = err as Error
                    setNotification({ message: error.message, type: "error" })
                })
        }
    }, [activeTable, connection, setNotification])

    useEffect(() => {
        if (connection !== null && activeTable !== "") {
            selectService({
                connection_id: connection.id,
                limit: 10,
                page: 1,
                order_by: "",
                order_type: "",
                search: "",
                table: activeTable,
            })
                .then((res) => {
                    setRows({
                        columns: res.data.columns,
                        pagination: res.pagination,
                        values: res.data.values,
                    })
                })
                .catch((err) => {
                    let error = err as Error
                    setNotification({ message: error.message, type: "error" })
                })
        }
    }, [reload, activeTable, connection, setNotification])

    useEffect(() => {
        if (connection !== null && activeTable !== "") {
            selectService({
                connection_id: connection.id,
                limit: 10,
                page: 1,
                order_by: orderBy,
                order_type: orderType,
                search: search,
                table: activeTable,
            })
                .then((res) => {
                    setRows({
                        columns: res.data.columns,
                        pagination: res.pagination,
                        values: res.data.values,
                    })
                })
                .catch((err) => {
                    let error = err as Error
                    setNotification({ message: error.message, type: "error" })
                })
        }
    }, [orderBy, orderType, activeTable, connection, search, setNotification])

    useEffect(() => {
        const checkList: Array<boolean> = new Array(rows?.values.length)
        checkList.fill(false)
        setCheckBoxList(checkList)
    }, [rows])


    if (connection === undefined || rows === undefined ) {
        return <div className="bg-primary min-w-screen min-h-screen flex flex-row">
            <PrimaryNavigation />
            <TableNavigation/>
            <Loading />
        </div>
    }

    return <div className="min-w-screen min-h-screen flex flex-row">

        <PrimaryNavigation />
        <TableNavigation />

        {showDetail !== "" ? <DetailRecord id={showDetail} closeFunc={() => setShowDetail("")} /> : null}
        {showCreate ? <CreateRecord closeFunc={() => setShowCreate(false)} columns={rows.columns} /> : null}

        <div className="flex flex-col w-full h-screen">
            <div className="h-full overflow-auto">
                <div className="bg-secondary h-full overflow-y-auto border-l-2 ">
                    <div className="m-8 flex flex-row justify-between items-center">
                        <div className="flex flex-row items-center text-lg">
                            <span className="font-bold text-gray-primary">Tables</span>
                            <span className="mx-2">/</span>
                            <span className="font-bold">{activeTable}</span>
                            <button onClick={() => setReload(!reload)}>
                                <IconRefresh className="ml-4 font-bold" size={20} />
                            </button>
                        </div>
                        <button
                            className="bg-dark-primary p-2 text-white flex flex-row"
                            onClick={() => setShowCreate(true)}>
                            <IconPlus />
                            <span className="mx-2">
                                New Record
                            </span>
                        </button>
                    </div>
                    <div className="m-8">
                        <div className="w-full h-12 rounded-none flex items-center flex-row relative z-10">
                            <IconSearch className="mx-3 text-gray absolute z-10" />
                            <form
                                onSubmit={(e) => handleSearch(e)}
                                className="h-full w-full bg-primary"
                            >
                                <input
                                    type="text"
                                    className="border-2 rounded-none pl-11 h-full w-full bg-primary placeholder-dark-text"
                                    placeholder="filter, ex where id = 1"
                                    onChange={(e) => setSearch(e.target.value)}
                                >
                                </input>
                            </form>
                        </div>
                    </div>
                    <div className="overflow-auto flex bg-secondary w-full mt-4">
                        <table className="border-collapse w-full px-24">
                            <thead className="px-24">
                                <TableHead
                                    data={rows.columns}
                                    checkbox={checkAll}
                                />
                            </thead>
                            <tbody>
                                <TableRowBody
                                    checkList={checkBoxList}
                                    checkListFunc={handleCheckList}
                                    columns={rows.columns}
                                    data={rows.values}
                                    detailFunc={setShowDetail}
                                />
                            </tbody>
                        </table>
                    </div>
                    <div className="text-right px-8 py-4 text-sm">
                        Showing {rows.values.length} of {rows.pagination?.total_data}
                    </div>
                    {
                        rows.pagination && rows.pagination.page !== rows.pagination?.total_pages && rows.pagination.total_pages > 1 ?
                            <div className="text-center pb-12">
                                <button className="py-2 px-12 bg-primary" onClick={(e) => nextPage(e)}>Load More</button>
                            </div>
                            :
                            null
                    }
                </div>
            </div>
            <BottomNav
                batchDelete={batchDelete}
                checkList={checkBoxList}
                runQuery={runQuery}
            />
        </div>
    </div >
}