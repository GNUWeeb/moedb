import { OverlayLayoutButton } from "@/components/overlay_layout_button"
import { OverLayLayoutButtonWrapper } from "@/components/overlay_layout_button_wrapper"
import { OverlayLayoutWrapper } from "@/components/overlay_layout_wrapper"
import { activeTableAtom } from "@/components/side_nav/primary"
import { ConnectionContext } from "@/context/connection"
import { NotificationContext } from "@/context/notification"
import { createRecordService } from "@/service/record_create"
import { IconBookmark } from "@tabler/icons-react"
import { useAtom } from "jotai"
import { useContext, useState } from "react"

export const CreateRecord: React.FC<{ columns: Array<string>, closeFunc: Function }> = ({ columns, closeFunc }) => {

    // internal state
    const [record, setRecord] = useState({})

    // shared state
    const [activeTable, setActiveTable] = useAtom(activeTableAtom)
    const { connection } = useContext(ConnectionContext)
    const { setNotification } = useContext(NotificationContext)

    const createRecord = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        try {
            e.preventDefault()
            await createRecordService({
                connection_id: connection!.id,
                table: activeTable,
                data: [record],
            })
            setNotification({ message: "success add new record", type: "success" })
            let newActiveTable = activeTable
            setActiveTable(newActiveTable)
            closeFunc()
        } catch (err) {
            let error = err as Error
            setNotification({ message: error.message, type: "error" })
        }
    }

    return <OverlayLayoutWrapper closeFunc={closeFunc}>
        <div>
            <div className="mx-8 mt-6">
                Create {activeTable}
            </div>
            {
                columns.map((column, index) => <div key={index} className="m-8 p-2 bg-primary rounded-md">
                    <div className="flex flex-row items-center font-bold text-sm">
                        <IconBookmark size={16} className="" />
                        <label>{column}</label>
                    </div>
                    <input
                        className="text-sm w-full px-2 py-2 bg-primary rounded-md outline-0"
                        onChange={(e) => {
                            let obj: any = {}
                            obj[column] = e.target.value
                            setRecord({ ...record, ...obj })
                        }}
                    />
                </div>)
            }
        </div>
        <OverLayLayoutButtonWrapper>
            <OverlayLayoutButton label="Cancel" onClick={() => closeFunc()} />
            <OverlayLayoutButton label="Create" onClick={createRecord} />
        </OverLayLayoutButtonWrapper>
    </OverlayLayoutWrapper>
}