import { ConnectionContext } from "@/context/connection"
import { connectService } from "@/service/connect"
import { Connection } from "@/type/connection"
import { getConnectionService } from "@/service/get_connection"
import { IconBox, IconDatabase, IconEdit, IconOutlet, IconPlus, IconServer, IconTrash, IconUser } from "@tabler/icons-react"
import React, { useContext, useEffect, useState } from "react"
import { useRouter } from 'next/router'
import Image from "next/image"
import { TopNav } from "@/components/top_nav/top_nav"
import { createConnectionService } from "@/service/create_connection"
import { deleteConnectionService } from "@/service/delete_connection"
import { NotificationContext } from "@/context/notification"

export default function Home() {
    const router = useRouter()
    const [connections, setConnections] = useState<Array<Connection>>([])
    const { setConnection } = useContext(ConnectionContext)
    const { setNotification } = useContext(NotificationContext)
    const [newConnForm, setNewConnForm] = useState(false)
    const [newConn, setNewConn] = useState<Connection>({
        database: "",
        driver: "postgres",
        id: 0,
        host: "",
        name: "",
        password: "",
        port: 0,
        username: ""
    })

    const getConnection = async () => {
        try {
            const res = await getConnectionService()
            setConnections(res.data)
        } catch (err) {
            let error = err as Error
            setNotification({ message: error.message, type: "error" })
        }
    }

    const connect = async (conn: Connection) => {
        try {
            const res = await connectService(conn.id)
            if (res) {
                setConnection(conn)
                router.push("/connection")
            }
        } catch (err) {
            let error = err as Error
            setNotification({ message: error.message, type: "error" })
        }
    }

    const createConnection = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        try {
            e.preventDefault()
            await createConnectionService(newConn)
            await getConnection()
            setNewConnForm(false)
        } catch (err) {
            let error = err as Error
            setNotification({ message: error.message, type: "error" })
        }
    }

    const deleteConnection = async (id: number) => {
        try {
            await deleteConnectionService(id)
            await getConnection()
        } catch (err) {
            let error = err as Error
            setNotification({ message: error.message, type: "error" })
        }
    }

    useEffect(() => {
        getConnection()
    }, [])

    return (
        <div className="flex flex-col w-screen h-screen">
            <TopNav />
            <div className="flex flex-col w-full h-full justify-center items-center">
                {
                    !newConnForm && <div className="rounded-2xl bg-secondary p-8 w-3/4 m-8 justify-center items-center">
                        {
                            connections && <div className="flex flex-col items-center mb-8">
                                {
                                    connections.map((value, index) => {
                                        return <div className="flex flex-row border-1 rounded-lg border w-full p-4 my-4">
                                            <div>
                                                <DriverIcon driver={value.driver} />
                                            </div>
                                            <div className="w-full ml-4">
                                                <button onClick={() => connect(value)}>
                                                    <div className="flex flex-col space-y-2">
                                                        <div className="flex flex-row items-center">
                                                            <div className="font-bold text-xl text-primary">{value.name[0].toLocaleUpperCase() + value.name.slice(1)}</div>
                                                        </div>
                                                        <div className="flex flex-row space-x-4">
                                                            <div className="flex flex-row text-sm justify-center items-center">
                                                                <span><IconDatabase size={18} className="text-red" /></span>
                                                                <span className="ml-1 text-secondary">{value.driver}</span>
                                                            </div>
                                                            <div className="flex flex-row text-sm justify-center items-center">
                                                                <span><IconServer size={18} className="text-blue" /></span>
                                                                <span className="ml-1 text-secondary">{value.host}</span>
                                                            </div>
                                                            <div className="flex flex-row text-sm justify-center items-center">
                                                                <span><IconOutlet size={18} className="text-yellow" /></span>
                                                                <span className="ml-1 text-secondary">{value.port}</span>
                                                            </div>
                                                            <div className="flex flex-row text-sm justify-center items-center">
                                                                <span><IconBox size={18} className="text-aqua" /></span>
                                                                <span className="ml-1 text-secondary">{value.database}</span>
                                                            </div>
                                                            <div className="flex flex-row text-sm justify-center items-center">
                                                                <span><IconUser size={18} className="text-purple" /></span>
                                                                <span className="ml-1 text-secondary">{value.username}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                            <div className="bg-gray1 mx-4" style={{ width: "1.5px" }}></div>
                                            <div className="flex flex-col space-y-2 justify-between">
                                                <button className="text-aqua">
                                                    <IconEdit size={18} />
                                                </button>
                                                <button className="text-red" onClick={() => deleteConnection(value.id)}>
                                                    <IconTrash size={18} />
                                                </button>
                                            </div>
                                        </div>


                                    })
                                }
                            </div>
                        }
                        <div className="flex flex-row justify-center">
                            <button className="bg-accent p-2 rounded-lg text-dark-secondary" onClick={() => setNewConnForm(true)}>
                                <div className="flex flex-row">
                                    <IconPlus />
                                    <span className="ml-2">New Connection</span>
                                </div>
                            </button>
                        </div>
                    </div>
                }
                {
                    newConnForm && <div className="rounded-2xl bg-secondary p-8 justify-center items-center">
                        <div className="flex flex-col space-y-4 justify-center items-center w-full">
                            <div>
                                <input type="text" className="py-2 bg-primary rounded-lg px-4" placeholder="connection name"
                                    onChange={(e) => setNewConn({ ...newConn, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <input type="text" className="py-2 bg-primary rounded-lg px-4" placeholder="driver" value="postgres"
                                    onChange={(e) => setNewConn({ ...newConn, driver: e.target.value })}
                                />
                            </div>
                            <div>
                                <input type="text" className="py-2 bg-primary rounded-lg px-4" placeholder="host"
                                    onChange={(e) => setNewConn({ ...newConn, host: e.target.value })}
                                />
                            </div>
                            <div>
                                <input type="text" className="p-2 bg-primary rounded-lg px-4" placeholder="port"
                                    onChange={(e) => setNewConn({ ...newConn, port: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <input type="text" className="p-2 bg-primary rounded-lg px-4" placeholder="user"
                                    onChange={(e) => setNewConn({ ...newConn, username: e.target.value })}
                                />
                            </div>
                            <div>
                                <input type="password" className="p-2 bg-primary rounded-lg px-4" placeholder="password"
                                    onChange={(e) => setNewConn({ ...newConn, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <input type="text" className="p-2 bg-primary rounded-lg px-4" placeholder="database"
                                    onChange={(e) => setNewConn({ ...newConn, database: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex flex-row justify-between w-full mt-12">
                            <button onClick={() => setNewConnForm(false)} className="rounded-lg bg-red p-2 text-dark-secondary">
                                <div className="flex flex-row">
                                    <span>cancel</span>
                                </div>
                            </button>
                            <button className="p-2 bg-green text-dark-secondary rounded-lg" onClick={(e) => createConnection(e)}>
                                save
                            </button>
                        </div>
                    </div>
                }
            </div>
        </div>

    )
}

export const ShowColumn: React.FC<{ data: Array<string> }> = ({ data }) => {
    return (
        <thead>
            <tr>
                {
                    data.map((value, index) => {
                        return <th className="border border-slate-300 text-slate-800 p-2" key={index}>{value}</th>
                    })
                }
            </tr>
        </thead>
    )
}

export const DriverIcon: React.FC<{ driver: string }> = ({ driver }) => {
    switch (driver) {
        case "postgres":
            return <Image src="/assets/postgres.png" alt="postgres" width={64} height={64} />
        default:
            return null
    }
}
