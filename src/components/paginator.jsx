import React, { useState } from 'react'

const Pagination = ({ total, current, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(current)

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (onPageChange) onPageChange(page)
  };

  const renderPages = () => {
    const pages = [];

    if (total <= 4) {
      for (let i = 1; i <= total; i++) {
        pages.push(
          <button
            key={i}
            className={`page-item ${i === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        )
      }
    } else {
      pages.push(
        <button
          key={1}
          className={`page-item ${1 === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      )

      if (currentPage > 2) {
        pages.push(<span key="start-dots" className="dots">...</span>)
      }

      let start = Math.max(2, currentPage - 1)
      let end = Math.min(total - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(
          <button
            key={i}
            className={`page-item ${i === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        )
      }

      if (currentPage < total - 2) {
        pages.push(<span key="end-dots" className="dots">...</span>);
      }

      pages.push(
        <button
          key={total}
          className={`page-item ${total === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(total)}
        >
          {total}
        </button>
      )
    }

    return pages
  }

  return (
    <div className="pagination w-full">
      <button
        className="page-item"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      {renderPages()}
      <button
        className="page-item"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === total}
      >
        &gt;
      </button>
    </div>
  )
}

export default Pagination
