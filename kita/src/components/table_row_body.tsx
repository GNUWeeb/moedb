import { IconArrowRight, IconSquare, IconSquareCheckFilled } from "@tabler/icons-react"
import { TableBody } from "./table_body"

export const TableRowBody: React.FC<{ columns: Array<string>, data: Array<any>, checkList: Array<boolean>, checkListFunc: Function, detailFunc: Function }> = ({ columns, data, checkList, checkListFunc, detailFunc }) => {

    return <>
        {
            data.map((value, index) => <tr key={index} className="hover:bg-primary">
                <td className="truncate text-left border-b-2 pb-1">
                    <button className="align-middle z-30" onClick={() => checkListFunc(index)}>
                        {
                            checkList[index] ?
                                <IconSquareCheckFilled size={19} />
                                :
                                <IconSquare size={18} />
                        }
                    </button>
                </td>
                {
                    checkList[index] ?
                        <TableBody data={value} columns={columns} onClick={() => detailFunc(value["id"])} />
                        :
                        <TableBody data={value} columns={columns} onClick={() => detailFunc(value["id"])} />
                }
                <td className="truncate text-left border-b-2 pb-1">
                    <button className="align-middle">
                        {
                            checkList[index] ?
                                <IconArrowRight size={18} onClick={() => detailFunc(value["id"])} />
                                :
                                <IconArrowRight size={18} onClick={() => detailFunc(value["id"])} />
                        }
                    </button>
                </td>
            </tr>
            )}
    </>
}