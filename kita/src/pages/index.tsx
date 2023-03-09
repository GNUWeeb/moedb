import { ConnectionContext } from "@/context/connection"
import { Navigation } from "@/layout/navigation"
import { connectService } from "@/service/connect"
import { Connection, getConnectionService } from "@/service/get_connection"
import { IconDatabase, IconPlug, IconPlugConnected, IconServer2 } from "@tabler/icons-react"
import React, { useContext, useEffect, useState } from "react"
import { useRouter } from 'next/router'
import selectService from "@/service/select"
import { TableContext } from "@/context/table"
import { TopNav } from "@/components/top_nav/top_nav"

export default function Home() {
    const router = useRouter()
    const [connections, setConnections] = useState<Array<Connection>>([])
    const { setConnection, connection } = useContext(ConnectionContext)
    const { table } = useContext(TableContext)
    const [rows, setRows] = useState<{
        values: Array<any>,
        columns: Array<string>
    }>()

    const getConnection = async () => {
        try {
            const res = await getConnectionService()
            setConnections(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const connect = async (conn: Connection) => {
        try {
            const res = await connectService(conn.id)
            if (res) {
                setConnection(conn)
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getConnection()
    }, [])

    const getData = async () => {
        if (connection != null && table != null) {
            const { data } = await selectService(table, connection.id)
            setRows(data)
        }
    }

    useEffect(() => {
        getData()
    }, [table])

    return (
        <div className="bg-gray-100">
            <TopNav />
            <div className="pl-[19.5rem] min-h-screen min-w-screen">
                <Navigation />
                <div className="flex flex-col w-full">
                    <div className="m-8 rounded-2xl bg-white p-8">
                        {
                            !table && (
                                <div className="flex flex-row space-x-4 items-center">
                                    <div className="rounded-full bg-cyan-100 p-2 text-cyan-500">
                                        <IconServer2 />
                                    </div>
                                    <div className="font-bold">Connections</div>
                                </div>
                            )
                        }
                        {
                            connections && !table && connections.map((value, index) => {
                                return <div key={index} className="p-4 mt-6">
                                    <button onClick={() => connect(value)} className="flex flex-row space-x-2">
                                        <div className="text-cyan-700">
                                            <IconDatabase />
                                        </div>
                                        <div className="text-cyan-700">{value.name}</div>
                                    </button>
                                </div>
                            })
                        }
                        {
                            rows && connection && (
                                <div className="overflow-x-auto flex bg-white w-full">
                                    <table className="border-collapse border w-full">
                                        <ShowColumn data={rows.columns} />
                                        <tbody>
                                            {
                                                rows.values.map((value, index) => {
                                                    let x = value as Map<string, any>
                                                    return <ShowData data={x} key={index} />
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            )
                        }
                    </div>

                </div>
            </div>
        </div>
    )
}


export const ShowData: React.FC<{ data: any }> = ({ data }) => {
    let keys = []
    for (let key in data) {
        keys.push(key)
    }

    return (
        <tr>
            {
                keys.map((value, index) => <td className="border border-slate-300" key={index}>{data[value]}</td>)
            }
        </tr>
    )
}


export const ShowColumn: React.FC<{ data: Array<string> }> = ({ data }) => {
    return (
        <thead>
            <tr>
                {
                    data.map((value, index) => {
                        return <th className="border border-slate-300" key={index}>{value}</th>
                    })
                }
            </tr>
        </thead>
    )
}