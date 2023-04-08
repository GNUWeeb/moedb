export type Records = {
    values: Array<any>,
    columns: Array<string>,
    pagination: {
        limit: number,
        page: number,
        total_data: number,
        total_pages: number,
    } | null
}