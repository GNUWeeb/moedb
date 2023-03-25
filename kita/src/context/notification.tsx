import { Notification } from '@/type/notification';
import React, {
    createContext,
    useEffect,
    useState,
} from 'react';


export const NotificationContext = createContext<{
    notification: Notification | null,
    setNotification: (v: Notification | null) => void
}>({
    notification: null,
    setNotification: () => { }
})

export const NotificationProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const [notification, setNotification] = useState<Notification | null>(null);

    useEffect(() => {
        if (notification != null) {
            setTimeout(async () => {
                setNotification(null)
            }, 2000)
        }
    }, [notification])

    return (
        <NotificationContext.Provider value={{
            notification: notification,
            setNotification: setNotification,
        }}>
            <>
                {children}
                {
                    notification && <ShowNotification notif={notification} />
                }
            </>
        </NotificationContext.Provider>
    )
};

export const ShowNotification: React.FC<{ notif: Notification }> = ({ notif }) => {
    switch (notif.type) {
        case "warnig":
            return <div className="fixed z-20 top-4 border-yellow bottom-0 left-100 right-4 w-1/5 h-16 bg-yellow text-dark-secondary block px-4 rounded-lg">
                <div className="flex flex-col justify-center min-h-full min-w-full">
                    <div className='text-sm'>{notif.message}</div>
                </div>
            </div>
        case "error":
            return <div className="fixed z-20 top-4 border-green bottom-0 left-100 right-4 w-1/5 h-16 bg-red ttext-dark-secondary block px-4 rounded-lg">
                <div className="flex flex-col justify-center min-h-full min-w-full">
                    <div className='text-sm'>{notif.message}</div>
                </div>
            </div>
        case "success":
            return <div className="fixed z-20 top-4 border-green bottom-0 left-100 right-4 w-1/5 h-16 bg-green text-dark-secondary block px-4 rounded-lg">
                <div className="flex flex-col justify-center min-h-full min-w-full">
                    <div className='text-sm'>{notif.message}</div>
                </div>
            </div>
        default:
            return <div className="fixed z-20 top-4 border-blue bottom-0 left-100 right-4 w-1/5 h-16 bg-blue text-dark-secondary block px-4 rounded-r-lg">
                <div className="flex flex-col justify-center min-h-full min-w-full">
                    <div className='text-sm'>{notif.message}</div>
                </div>
            </div>
    }
}
