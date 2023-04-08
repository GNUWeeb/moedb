export const TableBody: React.FC<{ data: any, columns: Array<string>, onClick: Function }> = ({ data, columns, onClick }) => {
    return <>
        {
            columns.map(
                (value, index) =>
                    <td className="truncate text-left border-b-2 text-sm py-4 pl-4" key={index} onClick={() => onClick()}>
                        <div className="align-middle">
                            {data[value]}
                        </div>
                    </td>
            )
        }
    </>
}
