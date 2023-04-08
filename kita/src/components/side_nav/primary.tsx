'use client';

import { ConnectionContext } from "@/context/connection"
import { NotificationContext } from "@/context/notification"
import { getListDatabaseService } from "@/service/database_list"
import { getTableService } from "@/service/get_table"
import { IconHome, IconTable, IconDatabase, IconLogout } from "@tabler/icons-react"
import { atom, useAtom } from "jotai"
import { useRouter } from "next/router"
import { useContext } from "react"
import { Button } from "./button";

export const listTableAtom = atom<Array<string>>([])
export const activeTableAtom = atom("")
export const activePrimaryMenu = atom("dashboard")
export const listDatabseAtom = atom<Array<string>>([])
export const activeDatabaseAtom = atom("")

export const PrimaryNavigation = () => {
    const { connection } = useContext(ConnectionContext)
    const { setNotification } = useContext(NotificationContext)
    const router = useRouter()
    const [activeMenu, setActiveMenu] = useAtom(activePrimaryMenu)
    const [, setListTable] = useAtom(listTableAtom)
    const [, setListDatabase] = useAtom(listDatabseAtom)

    const handleClickTable = async () => {
        try {
            setActiveMenu("table")
            router.push("/table")
            if (connection != null) {
                const { data } = await getTableService(connection.id)
                setListTable(data)
            }
        } catch (err) {
            let error = err as Error
            setNotification({ message: error.message, type: "error" })
        }
    }

    const handleClickHome = () => {
        setActiveMenu("dashboard")
        router.push("/dashboard")
    }

    const handleClickDatabase = async () => {
        try {
            setActiveMenu("database")
            router.push("/database")
            if (connection != null) {
                const { data } = await getListDatabaseService(connection.id)
                setListDatabase(data)
            }
        } catch (err) {
            let error = err as Error
            setNotification({ message: error.message, type: "error" })
        }
    }

    const handleClickLogout = () => {
        setActiveMenu("logout")
        router.push("/")
        setActiveMenu("dashboard")
    }

    return (
        <div className="bg-secondary w-20">
            <div className="flex flex-col space-y-6 mt-8">
                <Button Icon={<IconHome size={28} />} activeMenu={activeMenu} menu="dashboard" onClick={handleClickHome} />
                <Button Icon={<IconTable size={28} />} activeMenu={activeMenu} menu="table" onClick={handleClickTable} />
                <Button Icon={<IconDatabase size={28} />} activeMenu={activeMenu} menu="database" onClick={handleClickDatabase} />
                <Button Icon={<IconLogout size={28} />} activeMenu={activeMenu} menu="logout" onClick={handleClickLogout} />
            </div>
        </div>
    )
}