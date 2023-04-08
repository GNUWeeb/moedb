export const OverlayLayoutWrapper: React.FC<{ closeFunc: Function, children: React.ReactNode }> = ({ closeFunc, children }) => {
    return <div className="absolute inset-0 z-20 min-h-screen min-w-screen overflow-disable">
        <div className="flex flex-row w-full h-full">
            <div className="w-3/5 h-full bg-dark-primary opacity-20" onClick={() => closeFunc()} />
            <div className="w-2/5 bg-secondary flex flex-col justify-between">
                {children}
            </div>
        </div>
    </div>
}