import "./Pagination.css";

export default function Pagination({
    page,
    totalPages,
    onPageChange,
}) {

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="pagination">

            <button
                disabled={page === 0}
                onClick={() => onPageChange(page - 1)}
            >
                이전
            </button>

            {Array.from(
                { length: totalPages },
                (_, i) => (
                    <button
                        key={i}
                        className={
                            page === i
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            onPageChange(i)
                        }
                    >
                        {i + 1}
                    </button>
                )
            )}

            <button
                disabled={page === totalPages - 1}
                onClick={() =>
                    onPageChange(page + 1)
                }
            >
                다음
            </button>

        </div>
    );
}