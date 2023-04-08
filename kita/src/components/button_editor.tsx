export const EditorButton: React.FC<{ onClick: Function, label: string, bgColor: string, Icon: JSX.Element }> = ({ onClick, label, bgColor, Icon }) => {
    return <button className="p-4" onClick={() => onClick()}>
        <div className={`flex flex-row items-center bg-red px-2 rounded-md text-dark-secondary ${bgColor}`}>
            {Icon}
            <span className="ml-2">{label}</span>
        </div>
    </button>
}