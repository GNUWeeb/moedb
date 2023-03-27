import { Connection } from "@/type/connection"
import React, {
  createContext,
  useState,
} from 'react';

type Table = {
  name: string,
  pk_column?: string
}

export const TableContext = createContext<{
  table: Table | null,
  setTable: (v: Table) => void
}>({
  table: null,
  setTable: () => { }
})

export const TableProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [table, setTable] = useState<Table | null>(null);
  return (
    <TableContext.Provider
      value={{
        table: table,
        setTable: setTable,
      }}>
      {children}
    </TableContext.Provider>
  )
};
