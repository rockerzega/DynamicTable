import Spinner from './Spinner'
import Paginator from './Paginator'
import ModalFilter from './ModalFilter'
import React, { FC, useEffect, useState } from 'react'
import { DynamicTableType, ModalData } from '../types'
import {
  MinusOutlined,
  PlusOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons'

const DynamicTable: FC<DynamicTableType> = ({ children, ...props }) => {
  const { columns, expandable, pagination, onChange, ...otherProps } = props
  const [expandedRows, setExpandedRows] = useState(
    () => new Array(props.dataSource.length).fill(false)
  )
  const toggleRowExpanded = (index: number) => {
    const newExpandedRows = [...expandedRows]
    newExpandedRows[index] = !newExpandedRows[index]
    setExpandedRows(newExpandedRows)
  }
  const [primaryColor, setPrimaryColor] = useState<string | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(pagination.current)

  const hasFilter = columns ? columns.some(item => item.filters) : false
  const hasFilterDropdown = columns
    ? columns.some(item => item.filterDropdown)
    : false
  const modalData: ModalData[] = []
  if (hasFilter) {
    columns!.forEach((item) => {
      if (item.filters) {
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
    columns!.forEach((item) => {
      if (item.filterDropdown) {
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
  const onOk = (data: { firstSelect: string, secondSelect: string[] }) => {
    onChange!({
      current: currentPage,
      pageSize: pagination.defaultPageSize,
      total: pagination.total,
    }, {
      [data.firstSelect]: data.secondSelect
    }, null)
  }

  const handlePages = (newPage: number) => {
    setCurrentPage(newPage)
    onChange!(
      {
        current: newPage,
        pageSize: pagination.defaultPageSize,
        total: pagination.total,
      },
      { ['']: null },
      null
    )
  }

  useEffect(() => {
    const button = document.querySelector('.ant-btn-primary')
    console.log('columnas')
    console.log(columns)
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
          {hasFilter || hasFilterDropdown
            && (<ModalFilter
              data={modalData}
              onOk={onOk}
              color={primaryColor}
            />)
          }
          <button className="open-modal ml-2">
            {<SortAscendingOutlined />}
          </button>
        </div>
      </div>
      <div>
        <table className={'table'}>
          <thead key="mobile-table-head">
            <tr>
              <th key="mobile-head-cols" style={{ zIndex: 1 }}>Datos</th>
            </tr>
          </thead>
          {!otherProps.isLoading ? (<tbody>
            {props.dataSource.map((item, index) => {
              const { resultados, ...childItem } = item
              console.log('childItem : ', childItem)
              console.log('item : ', resultados)
              return (
                <React.Fragment key={item.id}>
                  <tr key={item.key || `row${index}`}>
                    <td key={'mobile-cols' + index}>
                      {columns!.map((column, index) => {
                        if (column.render) {
                          try {
                            const render = column.dataIndex
                              ? column.render(childItem[column.dataIndex], childItem)
                              : column.render('', childItem)
                            return (
                              <div
                                key={column.dataIndex + index}
                                className="table-div"
                                style={{
                                  justifyContent: `${column.align || 'start'}`,
                                }}
                              >
                                {column.title && (<>
                                  <b>{column.title}</b>:&nbsp;
                                </>)}
                                {render}
                              </div>
                            )
                          } catch (error) {
                            console.error(error)
                            return (
                              <div key={column.dataIndex + index}>
                                <b>{column.title}</b>: Fallido
                              </div>
                            )
                          }
                        }
                        return (
                          <div
                            key={column.dataIndex + index}
                            className="table-div"
                            style={{
                              justifyContent: `${column.align || 'start'}`,
                            }}
                          >
                            <b>
                              {column.title}
                            </b>:&nbsp;{childItem[column.dataIndex]}
                          </div>
                        )
                      })}
                      {expandable?.rowExpandable
                        ? expandable.rowExpandable(item) ? (
                          <span
                            style={{
                              display: 'flex',
                              cursor: 'pointer',
                              justifyContent: 'center',
                            }}
                            onClick={() => toggleRowExpanded(index)}
                          >
                            {expandedRows[index] ? <MinusOutlined /> : <PlusOutlined />}
                          </span>
                        ) : null
                        : (
                          <span
                            style={{
                              display: 'flex',
                              cursor: 'pointer',
                              justifyContent: 'center',
                            }}
                            onClick={() => toggleRowExpanded(index)}
                          >
                            {expandedRows[index]
                              ? <MinusOutlined />
                              : <PlusOutlined />
                            }
                          </span>
                        )}
                    </td>
                  </tr>
                  {expandable

                    && !!expandedRows[index]
                    && (
                      <tr
                        key={`expand-${index}`}
                        style={{
                          height: '0px',
                          width: '0px',
                        }}
                      >
                        <td key={item.key || 'expand-cell' + index} style={{
                          height: '0px',
                          width: '0px',
                        }}>
                          {
                            expandable && expandable.expandedRowRender
                              ? expandable.expandedRowRender(item)
                              : (<p>Sin datos</p>)
                          }
                        </td>
                      </tr>
                    )}
                </React.Fragment>
              )
            })}
            {children || null}
          </tbody>) : <Spinner color={primaryColor} />}
        </table>
        {pagination.total > 0 && (
          <Paginator
            total={Math.ceil(pagination.total / pagination.defaultPageSize)}
            current={pagination.current}
            onPageChange={(page: number) => handlePages(page)}
            color={primaryColor}
          />
        )}
      </div>
    </div>
  )
}

export default DynamicTable
