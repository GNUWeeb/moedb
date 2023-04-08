
import { IconTerminal } from "@tabler/icons-react"
import { useState } from "react"
import { Editor } from "./editor"

export const BottomNav: React.FC<{ checkList: Array<boolean>, runQuery: Function, batchDelete: Function }> = ({ checkList, runQuery, batchDelete }) => {
    const [showEditor, setShowEditor] = useState(false)
    return <div className="inset-0 justify-end bg-primary">
        <div className="w-full flex flex-col bg-secondary border-l-2 border-t-2">
            {
                showEditor ?
                    <Editor closeFunc={() => setShowEditor(false)} runQuery={() => runQuery()} />
                    :
                    <div className="flex flex-row justify-between">
                        <div>
                            <button className="p-4" onClick={() => setShowEditor(true)}>
                                <div className="flex flex-row items-center bg-green px-2 py-1 text-dark-secondary">
                                    <IconTerminal size={18} />
                                    <span className="ml-2">Query</span>
                                </div>
                            </button>
                        </div>
                        <div>
                            {
                                checkList.filter((value) => value == true).length > 0 &&
                                <button className="p-4" onClick={() => batchDelete()}>
                                    <div className="flex flex-row items-center bg-red px-2 py-1 text-dark-secondary">
                                        <IconTerminal size={18} />
                                        <span className="ml-2">Delete</span>
                                    </div>
                                </button>
                            }
                        </div>
                    </div>
            }
        </div>
    </div>

}