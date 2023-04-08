export const OverlayLayoutButton: React.FC<{ onClick: Function, label: string }> = ({ onClick, label }) => {
    return <button className="bg-dark-primary p-2 text-white" onClick={(e) => onClick(e)}>
        <span className="mx-2">
            {label}
        </span>
    </button>
}