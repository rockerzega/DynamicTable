import React from 'react'

export interface Columns {
  title: string
  dataIndex: string
  key: string
  render?: (text: any, record: any) => React.ReactNode
  width?: number
  sorter?: boolean
  align?: 'left' | 'right' | 'center'
  filters?: Record<string, any>
  filterDropdown?: React.ReactNode | ((props: any) => React.ReactNode)
}

export type SortOrder = 'descend' | 'ascend' | null;

export type Key = React.Key

export type FilterValue = (Key | boolean)[]

export interface PaginationData {
  current: number
  pageSize: number
  total: number
}

export interface SorterResult {
  order?: SortOrder;
  field?: Key | readonly Key[];
  columnKey?: Key;
}

export interface DynamicTableType {
  color?: string,
  onChange?: (
    pagination: PaginationData,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult | SorterResult[] | null,
  ) => void;
  columns?: Columns[]
  dataSource: any[]
  children?: React.ReactNode
  pagination: {
    current: number,
    defaultPageSize: number,
    total: number,
  }
  isLoading: boolean
  expandable?: {
    rowExpandable?: (record: any) => boolean
    expandedRowRender: (record: any) => React.ReactNode
  }
}
