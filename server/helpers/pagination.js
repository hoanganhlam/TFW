export function Pagination({results, page, pageSize, total}) {
    return {
        results: results,
        currentPage: page,
        pageSize: pageSize,
        total: total
    }
}
