import { OverlayLayoutButton } from "@/components/overlay_layout_button"
import { OverLayLayoutButtonWrapper } from "@/components/overlay_layout_button_wrapper"
import { OverlayLayoutWrapper } from "@/components/overlay_layout_wrapper"
import { activeTableAtom } from "@/components/side_nav/primary"
import { ConnectionContext } from "@/context/connection"
import { NotificationContext } from "@/context/notification"
import { getDetailRecordService } from "@/service/record_detail"
import { updateRecordService } from "@/service/record_update"
import { IconBookmark } from "@tabler/icons-react"
import { useAtom } from "jotai"
import { useContext, useEffect, useState } from "react"

export const DetailRecord: React.FC<{ id: any, closeFunc: Function }> = ({ id, closeFunc }) => {

    // internal state
    const [record, setRecord] = useState<{
        columns: Array<string>,
        values: any
    }>()

    // shares state
    const [activeTable, setActiveTable] = useAtom(activeTableAtom)
    const { connection } = useContext(ConnectionContext)
    const { setNotification } = useContext(NotificationContext)
    const updateRecord = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        try {
            e.preventDefault()
            await updateRecordService({
                connection_id: connection!.id,
                table: activeTable,
                data: record?.values,
            })
            setNotification({ message: "success update record record", type: "success" })
            let newActiveTable = activeTable
            setActiveTable(newActiveTable)
            closeFunc()
        } catch (err) {
            let error = err as Error
            setNotification({ message: error.message, type: "error" })
        }
    }

    useEffect(() => {
        const detailRecord = async () => {
            try {
                const { data } = await getDetailRecordService({
                    connection_id: connection!.id,
                    id: id,
                    table: activeTable,
                })
                setRecord(data)
            } catch (err) {
                let error = err as Error
                setNotification({ message: error.message, type: "error" })
            }
        }
        detailRecord()
    }, [activeTable, connection, id, setNotification])

    return <OverlayLayoutWrapper closeFunc={closeFunc}>
        <div>
            <div className="mx-8 mt-6">
                Update {activeTable}
            </div>
            {
                record && record.columns.map((column, index) => <div key={index} className="m-8 p-2 bg-primary rounded-md">
                    <div className="flex flex-row items-center font-bold text-sm">
                        <IconBookmark size={16} className="" />
                        <label>{column}</label>
                    </div>
                    <input
                        value={record.values[column]}
                        className="text-sm w-full px-2 py-2 bg-primary rounded-md outline-0"
                        onChange={(e) => {
                            let objData: any = {}
                            objData[column] = e.target.value
                            setRecord({ ...record, values: { ...record.values, ...objData } })
                        }}
                    />
                </div>)
            }
        </div>
        <OverLayLayoutButtonWrapper>
            <OverlayLayoutButton label="Cancel" onClick={() => closeFunc()} />
            <OverlayLayoutButton label="Save Changes" onClick={(e: any) => updateRecord(e)} />
        </OverLayLayoutButtonWrapper>
    </OverlayLayoutWrapper>
}