export const OverLayLayoutButtonWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div className="w-full text-right p-3 space-x-2 border-t-2">
        {children}
    </div>
}