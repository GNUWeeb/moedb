import { IconHome } from "@tabler/icons-react"

export const NavHome: React.FC<{ onClick: Function }> = ({ onClick }) => {
    return (
        <button className="w-full flex flex-row" onClick={() => onClick()}>
            <div className="p-4 bg-red text-dark-secondary" >
                <IconHome />
            </div>
            <div className="self-center w-full flex flex-row ml-6">Home</div>
        </button>
    )
}