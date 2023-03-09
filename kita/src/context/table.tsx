import { Connection } from '@/service/get_connection';
import React, {
  createContext,
  useState,
} from 'react';

export const TableContext = createContext<{
  table: string | null,
  setTable: (v: string) => void
}>({
  table: null,
  setTable: () => { }
})

export const TableProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [table, setTable] = useState<string | null>(null);
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
