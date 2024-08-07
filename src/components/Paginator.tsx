import React, { FC, useState } from 'react'

const Paginator: FC<{
  total: number
  current: number
  onPageChange?: (page: number) => void
  color?: string
}> = ({ total, current, onPageChange, color }) => {
  const [currentPage, setCurrentPage] = useState(current)

  const handlePageChange = (page: number) => {
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
            className={
              `page-item ${i === currentPage && !color ? 'active' : ''}`
            }
            {...(i === currentPage && color) && { style : {
              borderColor: color,
              color,
            }}}
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
          className={
            `page-item ${1 === currentPage && !color ? 'active' : ''}`
          }
          {...(1 === currentPage && color) && { style : {
            borderColor: color,
            color,
          }}}
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
            className={
              `page-item ${i === currentPage && !color ? 'active' : ''}`
            }
            {...(i === currentPage && color) && { style : {
              borderColor: color,
              color,
            }}}
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
    <div className="pagination w-full mt-2">
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

export default Paginator
