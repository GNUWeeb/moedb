import { OneDark } from "@/etc/monaco-theme"
import MonacoEditor, { useMonaco } from "@monaco-editor/react"
import { IconSquareRoundedX, IconTerminal2 } from "@tabler/icons-react"
import { atom, useAtom } from "jotai"
import { editor } from "monaco-editor"
import { useEffect, useRef } from "react"
import { EditorButton } from "./button_editor"


export const queryAtom = atom<string | undefined>("")

export const Editor: React.FC<{ runQuery: Function, closeFunc: Function }> = ({ runQuery, closeFunc }) => {

    const [, setQuery] = useAtom(queryAtom)
    const monaco = useMonaco()
    const valueGetter = useRef()

    const handleEditorDidMount = (_valueGetter: any) => {
        valueGetter.current = _valueGetter.current;
    }

    useEffect(() => {
        if (monaco != null) {
            monaco.editor.defineTheme('onedark', OneDark as editor.IStandaloneThemeData)
        }
    }, [monaco])

    return monaco ? <>
        <MonacoEditor
            defaultLanguage="sql"
            theme="onedark"
            height="30vh"
            className="font-bold font-editor h-full"
            onMount={handleEditorDidMount}
            onChange={(e) => setQuery(e)}
        />
        <div className="flex flex-row justify-between">
            <div>
                <EditorButton
                    bgColor="bg-green"
                    label="run"
                    onClick={() => runQuery()}
                    Icon={<IconTerminal2 size={18} />}
                />
                <EditorButton
                    bgColor="bg-red"
                    label="close"
                    onClick={() => closeFunc()}
                    Icon={<IconSquareRoundedX size={18} />}
                />
            </div>
        </div>
    </> : null
}
