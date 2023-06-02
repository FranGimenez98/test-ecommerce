import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }) => {
  const router = useRouter();
  const [pageNumbers, setPageNumbers] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const visiblePages = 5; // Número de páginas visibles en el paginado
    const ellipsis = "...";

    let startPage =
      Math.floor((currentPage - 1) / visiblePages) * visiblePages + 1;
    let endPage = Math.min(startPage + visiblePages - 1, totalPages);

    const numbers: React.ReactNode[] = [];

    if (startPage > 1) {
      numbers.push(ellipsis);
    }

    for (let i = startPage; i <= endPage; i++) {
      numbers.push(i);
    }

    if (endPage < totalPages) {
      numbers.push(ellipsis);
    }

    setPageNumbers(numbers);
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    const query = { ...router.query, page: page.toString() };
    router.push({
      pathname: router.pathname,
      query: query,
    });
  };

  return (
    <div className="pagination flex items-center justify-center">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="default-button m-2 px-1 py-1 bg-black text-white cursor-pointer"
      >
        <FiChevronLeft className="text-xl" />
      </button>
      <div className="page-numbers">
        {pageNumbers.map((item, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(item as number)}
            className={
              item === currentPage
                ? "px-3 py-1 font-semibold bg-black text-white"
                : "px-3 py-1 font-semibold bg-white"
            }
          >
            {item}
          </button>
        ))}
      </div>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`default-button m-1 px-1 py-1 ${
          currentPage === totalPages ? "bg-gray-300" : "bg-black text-white"
        }`}
      >
        <FiChevronRight
          className={`text-xl ${
            currentPage === totalPages ? "text-gray-400" : "text-white"
          }`}
        />
      </button>
    </div>
  );
};

export default Pagination;
