import "./SearchFilter.css";

export default function SearchFilter({
    search,
    setSearch,
    usePrice = false,
    useCategory = false,
    useSort = false,
    useSearchType = false,
}) {

    const changeValue = (key, value) => {
        setSearch({
            ...search,
            [key]: value,
        });
    };

    return (
        <div className="filterBox">

            {useSearchType && (
                <select
                    value={search.searchType ?? "titleContent"}
                    onChange={(e) =>
                        changeValue("searchType", e.target.value)
                    }
                >
                    <option value="titleContent">제목+내용</option>
                    <option value="title">제목</option>
                    <option value="content">내용</option>
                </select>
            )}

            <input
                placeholder="검색어"
                value={search.keyword}
                onChange={(e) =>
                    changeValue("keyword", e.target.value)
                }
            />

            {usePrice && (
                <input
                    type="number"
                    placeholder="최소 가격"
                    value={search.minPrice}
                    onChange={(e) =>
                        changeValue("minPrice", e.target.value)
                    }
                />
            )}

            {useCategory && (
                <select
                    value={search.category}
                    onChange={(e) =>
                        changeValue("category", e.target.value)
                    }
                >
                    <option value="">전체</option>
                    <option value="COMIC">만화</option>
                    <option value="VIDEO">영상</option>
                    <option value="ILLUSTRATION">일러스트</option>
                    <option value="CHARACTER">캐릭터</option>
                    <option value="EMOTICON">이모티콘</option>
                    <option value="DESIGN">디자인</option>
                </select>
            )}

            {useSort && (
                <select
                    value={search.sort}
                    onChange={(e) =>
                        changeValue("sort", e.target.value)
                    }
                >
                    <option value="latest">최신순</option>
                    <option value="priceAsc">가격 낮은순</option>
                    <option value="priceDesc">가격 높은순</option>
                </select>
            )}

        </div>
    );
}