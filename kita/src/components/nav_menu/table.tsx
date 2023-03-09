import { ConnectionContext } from "@/context/connection"
import { TableContext } from "@/context/table"
import { getTableService } from "@/service/get_table"
import selectService from "@/service/select"
import { IconArrowLeft, IconArrowRight, IconCaretRight, IconCircle, IconCircle0Filled, IconCircle1Filled, IconCircleCaretRight, IconTable } from "@tabler/icons-react"
import React, { useContext, useEffect, useState } from "react"

export const NavTable: React.FC<{ onClick: Function }> = ({ onClick }) => {
    return (
        <button className="w-full flex flex-row" onClick={() => onClick()}>
            <div className="p-4" >
                <IconTable />
            </div>
            <div className="self-center w-full flex flex-row justify-between">
                <div>Table</div>
                <div className="mr-4">
                    <IconCaretRight />
                </div>
            </div>
        </button>
    )
}