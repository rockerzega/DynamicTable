import React, { useRef, useState } from 'react'
import './main.css'
import { PlusOutlined, MinusOutlined, CaretLeftOutlined, CaretRightOutlined, FilterOutlined } from '@ant-design/icons'

const DynamicTable = ({ children, ...props }) => {
  const { columns, menuOptions, expandable, filter , pagination, onChange, ...otherProps } = props;
  const [expandedRows, setExpandedRows] = useState(() => new Array(props.dataSource.length).fill(false));
  console.log(pagination)
  const toggleRowExpanded = (index) => {
    const newExpandedRows = [...expandedRows]
    newExpandedRows[index] = !newExpandedRows[index]
    setExpandedRows(newExpandedRows)
  }
  const [currentPage, setCurrentPage] = useState(pagination.current)
  const totalPages = useRef(Math.ceil(pagination.total/pagination.defaultPageSize))
  const handlePages = (newPage) => {
    setCurrentPage(newPage)
    onChange({ current: newPage, pageSize: pagination.defaultPageSize })
  }
  

  return (
    <div style={{ display: 'flex' }}>
        <div  className={props.className || ''}>
        {filter && filter.button && (
          <div>
            {filter.button}
          </div>
        )}
          <table className={'table'}>
            <thead key="mobile-table-head">
              <tr>
                <th key="mobile-head-cols">Datos</th>
              </tr>
            </thead>
            <tbody>
              {props.dataSource.map((item, index) => (
                <React.Fragment key={item.id}>
                  <tr key={item.key  || `row${index}`}>
                    <td key={'mobile-cols'+index}>
                      {columns.map((column, index) => {
                        if (column.render) {
                          try {
                            const render = column.dataIndex
                              ? column.render(item[column.dataIndex], item)
                              : column.render(item)
                            return (
                              <div key={index} className="table-div" style={{
                                justifyContent: `${column.align || 'start'}`,
                              }}>
                                {column.title && <><b>{column.title}</b>:</> } {render} <div className="filtro-icon">{<FilterOutlined />}</div>
                              </div>
                            )
                          } catch (error) {
                            return (
                              <div key={index}>
                                <b>{column.title}</b>: Fallido
                              </div>
                            )
                          }
                        }
                        return (
                          <div key={index} className="table-div" style={{
                            justifyContent: `${column.align || 'start'}`,
                          }}>
                            <b>{column.title}</b>: {item[column.dataIndex]}
                          </div>
                        )
                      })}
                      {expandable.rowExpandable(item) ? (
                          <span
                            style={{
                              display: 'flex',
                              cursor: 'pointer',
                              justifyContent: 'center',
                            }}
                            onClick={() => toggleRowExpanded(index)}>
                            {expandedRows[index] ? <MinusOutlined /> : <PlusOutlined />}
                          </span>
                        ) : null}
                    </td>
                  </tr>
                  {expandable
                  && expandable.rowExpandable(item)
                  && expandedRows[index]
                  && (
                    <tr
                      key={`expand-${index}`}
                      style={{
                        height: '0px',
                        width: '0px',
                      }}
                    >
                      <td key={item.key || 'expand-cell'+index} style={{
                        height: '0px',
                        width: '0px',
                      }}>
                        {expandable.expandedRowRender(item)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {children}
            </tbody>
          </table>
          {pagination.total > 0 && (<div className="pagination">
            <button onClick={()=> handlePages(Math.max(pagination.current - 1, 1))} disabled={pagination.current === 1}>
              {<CaretLeftOutlined />}
            </button>
            <span>{currentPage} de {Math.ceil(pagination.total/pagination.defaultPageSize)}</span>
            <button onClick={() => handlePages(Math.min(pagination.current + 1, Math.ceil(pagination.total/pagination.defaultPageSize)))} disabled={pagination.current === totalPages.current}>
              {<CaretRightOutlined />}
            </button>
          </div>)}
        </div>
    </div>
  )
}

export default DynamicTable
