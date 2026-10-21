function Pagination({ page, setPage, pageSize, setPageSize, total }) {
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const end = Math.min(start + pageSize, total);



    function changePageSize(event) {
        setPageSize(Number(event.target.value));
        setPage(1);
    }
    return (
        <div className="history-pagination-container">
            <div className="history-pagination-info">
                <p>Showing {start + 1}–{end} of {total} results</p>
                <label>
                    Per page
                    <select value={pageSize} onChange={changePageSize}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">15</option>
                    </select>
                </label>
            </div>
            <nav className="history-pagination" aria-label="Prompt history pages">

                <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Previous
                </button>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map(number => (
                    <button
                        type="button"
                        key={number}
                        className={page === number ? "active" : ""}
                        aria-current={page === number ? "page" : undefined}
                        onClick={() => setPage(number)}
                    >
                        {number}
                    </button>
                ))}

                <button
                    type="button"
                    disabled={page === pageCount}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>

            </nav>
        </div>
    );
}
export default Pagination;
