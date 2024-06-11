import React, { useRef, useState } from 'react'
import './main.css'
import CustomModal from './components/modal'
import { PlusOutlined, MinusOutlined, CaretLeftOutlined, CaretRightOutlined, SortAscendingOutlined } from '@ant-design/icons'
// import CalendarComponent from './components/calendar-component'
import Calendar from './components/calendar'

const DynamicTable = ({ children, ...props }) => {
  const { columns, menuOptions, expandable, filters , pagination, onChange, ...otherProps } = props
  const [expandedRows, setExpandedRows] = useState(() => new Array(props.dataSource.length).fill(false))
  const toggleRowExpanded = (index) => {
    const newExpandedRows = [...expandedRows]
    newExpandedRows[index] = !newExpandedRows[index]
    setExpandedRows(newExpandedRows)
  }
  const [currentPage, setCurrentPage] = useState(pagination.current)
  const totalPages = useRef(Math.ceil(pagination.total/pagination.defaultPageSize))
  const [open, setOpen] = useState(true)
  const hasFilter = columns.some(item => item.filters)
  const modalData = []
  if(hasFilter) {
    columns.forEach((item, index) => {
      if(item.filters) {
        modalData.push({
          label: item.title,
          value: item.dataIndex,
          filters: item.filters
        })  
      }
    })
  }
  const onOk = (data) => {
    // console.log('Columna : ', column)
    console.log('Opcion : ', data)
    onChange({ current: currentPage, pageSize: pagination.defaultPageSize }, {
      [data.firstSelect]: [data.secondSelect]
    }, undefined)
  }
  
  const handlePages = (newPage) => {
    setCurrentPage(newPage)
    onChange({ current: newPage, pageSize: pagination.defaultPageSize })
  }
  

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div id="options-buttons"className="option-buttons">
        {hasFilter
          && (<CustomModal
              data={modalData}
              onOk={onOk}
            />)
        }
        <button className="open-modal">{<SortAscendingOutlined />}</button>
      </div>
      <Calendar />
      <div  className={props.className || ''}>
        <table className={'table'}>
          <thead key="mobile-table-head">
            <tr>
              <th key="mobile-head-cols" style={{ zIndex: 1 }}>Datos</th>
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
                              {column.title && <><b>{column.title}</b>:</> }
                              {render}
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
