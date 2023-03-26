import { ConnectionContext } from '@/context/connection';
import { NotificationContext } from '@/context/notification';
import { TableContext } from '@/context/table';
import selectService from '@/service/select';
import { useContext, useEffect, useState } from 'react'

export const useGetData = () => {
    const [rows, setRows] = useState<{
        values: [],
        columns: []
    }>()
    let response = {}
    const { connection } = useContext(ConnectionContext)
    const { table } = useContext(TableContext)
    const { setNotification } = useContext(NotificationContext)

    useEffect(() => {
        if (connection != null && table != null) {
            selectService(table, connection.id)
                .then(({ data }) => {
                    setRows(data)
                    response = data
                })
                .catch((err) => {
                    let error = err as Error
                    setNotification({ message: error.message, type: "error" })
                })
        }
    }, [table])

    return { rows, setRows, response };
};