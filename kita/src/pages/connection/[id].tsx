import { Connection } from "@/type/connection"
import { getDetailConnectionService } from "@/service/detail_connection"
import { updateConnectionService } from "@/service/update_connection"
import React, { useContext, useEffect, useState } from "react"
import { useRouter } from 'next/router'
import Image from "next/image"
import { TopNav } from "@/components/top_nav/top_nav"
import { NotificationContext } from "@/context/notification"

export default function EditConnection() {
    const router = useRouter()
    const { id } = router.query
    const { setNotification } = useContext(NotificationContext)
    const [connection, setConnection] = useState<Connection>()

    const updateCOnnection = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        try {
            await updateConnectionService(connection!)
            setNotification({ message: "success update connection!", type: "success" })
            router.push("/")
        } catch (err) {
            const error = err as Error
            setNotification({ message: error.message, type: "error" })
        }
    }

    useEffect(() => {
        const getDetailConnection = async () => {
            try {
                if (id != undefined) {
                    const { data } = await getDetailConnectionService(parseInt(id.toString()))
                    setConnection(data)
                }
            } catch (err) {
                const error = err as Error
                setNotification({ message: error.message, type: "error" })
            }
        }
        getDetailConnection()
    }, [id, setNotification])

    return (
        <div className="flex flex-col w-screen h-screen">
            <TopNav />
            <div className="flex flex-col w-full h-full justify-center items-center">
                <div className="rounded-2xl bg-secondary p-8 justify-center items-center">

                    {
                        connection && <div className="flex flex-col space-y-4 justify-center items-center w-full">
                            <div>
                                <input type="text" className="py-2 bg-primary rounded-lg px-4" placeholder="connection name"
                                    value={connection.name}
                                    onChange={(e) => setConnection({ ...connection, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <input type="text" className="py-2 bg-primary rounded-lg px-4" placeholder="driver"
                                    value={connection.driver}
                                    onChange={(e) => setConnection({ ...connection, driver: e.target.value })}
                                />
                            </div>
                            <div>
                                <input type="text" className="py-2 bg-primary rounded-lg px-4" placeholder="host"
                                    value={connection.host}
                                    onChange={(e) => setConnection({ ...connection, host: e.target.value })}
                                />
                            </div>
                            <div>
                                <input type="text" className="p-2 bg-primary rounded-lg px-4" placeholder="port"
                                    value={connection.port}
                                    onChange={(e) => setConnection({ ...connection, port: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <input type="text" className="p-2 bg-primary rounded-lg px-4" placeholder="user"
                                    value={connection.username}
                                    onChange={(e) => setConnection({ ...connection, username: e.target.value })}
                                />
                            </div>
                            <div>
                                <input type="password" className="p-2 bg-primary rounded-lg px-4" placeholder="password"
                                    value={connection.password}
                                    onChange={(e) => setConnection({ ...connection, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <input type="text" className="p-2 bg-primary rounded-lg px-4" placeholder="database"
                                    value={connection.database}
                                    onChange={(e) => setConnection({ ...connection, database: e.target.value })}
                                />

                            </div>
                        </div>
                    }

                    <div className="flex flex-row justify-between w-full mt-12">
                        <button onClick={() => router.push("/")} className="rounded-lg bg-red p-2 text-dark-secondary">
                            <div className="flex flex-row">
                                <span>cancel</span>
                            </div>
                        </button>
                        <button className="p-2 bg-green text-dark-secondary rounded-lg" onClick={(e) => updateCOnnection(e)}>
                            save
                        </button>
                    </div>
                </div>
            </div >
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
