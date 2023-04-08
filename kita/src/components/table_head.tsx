import { IconCheckbox, IconDots } from "@tabler/icons-react"
import { atom, useAtom } from "jotai"
import { activeTableAtom } from "./side_nav/primary"

export const orderByAtom = atom("")
export const orderTypeAtom = atom("ASC")

export const TableHead: React.FC<{ data: Array<string>, checkbox: () => void }> = ({ data, checkbox }) => {
    const [, setOrderColumn] = useAtom(orderByAtom)
    const [orderType, setOrderType] = useAtom(orderTypeAtom)

    return (
        <tr>
            <th className="text-dark-secondary w-0 pb-1 text-left border-b-2 pr-4 hover:bg-primary">
                <button onClick={checkbox} className="align-middle">
                    <IconCheckbox size={18} />
                </button>
            </th>
            {
                data.map((value, index) => {
                    return <th className="text-left border-b-2 py-4 pl-4 hover:bg-primary" key={index} onClick={() => {
                        setOrderColumn(value)
                        if (orderType === "ASC") {
                            setOrderType("DESC")
                        } else {
                            setOrderType("ASC")
                        }
                    }}>
                        <div className="align-middle">{value}</div>
                    </th>
                })
            }
            <th className="text-dark-secondary w-0 pb-1 text-left border-b-2 pr-4 hover:bg-primary">
                <button onClick={checkbox} className="align-middle">
                    <IconDots size={18} />
                </button>
            </th>
        </tr>
    )
}
