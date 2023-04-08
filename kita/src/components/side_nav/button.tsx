
export const Button: React.FC<{ menu: string, activeMenu: string, Icon: JSX.Element, onClick: Function }> = ({ menu, activeMenu, Icon, onClick }) => {
    return menu === activeMenu
        ?
        <button className="flex flex-row justify-center items-center bg-primary mx-2 py-2" onClick={() => onClick()}>
            {Icon}
        </button>
        :
        <button className="flex flex-row justify-center items-center py-2 mx-2 hover:bg-primary" onClick={() => onClick()}>
            {Icon}
        </button>
}