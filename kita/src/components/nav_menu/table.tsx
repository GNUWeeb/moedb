import { IconCaretDown, IconCaretRight, IconTable } from "@tabler/icons-react"
import React from "react"

export const NavTable: React.FC<{ onClick: Function, active: boolean }> = ({ onClick, active }) => {
    return (
        <button className="w-full flex flex-row" onClick={() => onClick()}>
            <div className="p-4 bg-red text-dark-secondary" >
         <IconTable />
            </div>
            <div className="self-center w-full flex flex-row justify-between ml-6">
                <div>Table</div>
                <div className="mr-4">
                    {active ? <IconCaretDown /> : <IconCaretRight/>}
                </div>
            </div>
        </button>
    )
}