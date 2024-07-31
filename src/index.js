import React, { useRef, useState, useEffect } from 'react'
import './main.css'
import './css/other.css'
import CustomModal from './components/modal'
import { PlusOutlined, MinusOutlined, CaretLeftOutlined, CaretRightOutlined, SortAscendingOutlined } from '@ant-design/icons'
import Pagination from "./components/paginator"
import Spinner from './components/Spinner'

const DynamicTable = ({ children, ...props }) => {
  const { columns, menuOptions, expandable, filters , pagination, onChange, ...otherProps } = props
  const [expandedRows, setExpandedRows] = useState(() => new Array(props.dataSource.length).fill(false))
  const toggleRowExpanded = (index) => {
    const newExpandedRows = [...expandedRows]
    newExpandedRows[index] = !newExpandedRows[index]
    setExpandedRows(newExpandedRows)
  }
  const [primaryColor, setPrimaryColor] = useState(null)
  const [currentPage, setCurrentPage] = useState(pagination.current)
  const totalPages = useRef(Math.ceil(pagination.total/pagination.defaultPageSize))
  const [open, setOpen] = useState(true)
  const [page, setPage] = useState(1)

  const hasFilter = columns.some(item => item.filters)
  const hasFilterDropdown = columns.some(item => item.filterDropdown)
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
  if (hasFilterDropdown) {
    console.log('este es el filterDropdown')
    columns.forEach((item, index) => {
      if(item.filterDropdown) {
        modalData.push({
          label: item.title,
          value: item.dataIndex,
          filterDropdown: item.filterDropdown,
        })
        console.log('modal filterDropdown', item.title)
        console.log(item.filterDropdown)
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
  
  useEffect(() => {
    const button = document.querySelector('.ant-btn-primary');
    if (button) {
      const style = window.getComputedStyle(button)
      setPrimaryColor(style.backgroundColor)
    }
  }, [])

  return (
    <div>
      <div id="ribbon-buttons" className="flex">
        <div style={{ width: '80%' }}></div>
        <div id="buttons" className="flex justify-end w-1/5">
          {hasFilter
            && (<CustomModal
                data={modalData}
                onOk={onOk}
                color={primaryColor}
              />)
          }
          <button className="open-modal ml-2">{<SortAscendingOutlined />}</button>
        </div>
      </div>
      <div  className={props.className || ''}>
        <table className={'table'}>
          <thead key="mobile-table-head">
            <tr>
              <th key="mobile-head-cols" style={{ zIndex: 1 }}>Datos</th>
            </tr>
          </thead>
          {!otherProps.isLoading ? (<tbody>
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
          </tbody>) : <Spinner color={primaryColor} />}
        </table>
        {pagination.total > 0 && (
          <Pagination
            total={Math.ceil(pagination.total / pagination.defaultPageSize)}
            current={pagination.current}
            onPageChange={(page) => handlePages(page)}
          />
        )}
      </div>
    </div>
  )
}

export default DynamicTable
