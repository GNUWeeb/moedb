import { Connection } from "@/type/connection"
import React, {
  createContext,
  useState,
} from 'react';

export const ConnectionContext = createContext<{
  connection: Connection | null,
  setConnection: (v: Connection) => void
}>({
  connection: null,
  setConnection: () => { }
})

export const ConnectionProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [conn, setConn] = useState<Connection | null>(null);
  return (
    <ConnectionContext.Provider
      value={{
        connection: conn,
        setConnection: setConn,
      }}>
      {children}
    </ConnectionContext.Provider>
  )
};
