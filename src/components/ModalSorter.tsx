import { SortAscendingOutlined } from '@ant-design/icons'
import React, { useState } from 'react'

interface ModalFilterProps {
  title?: string
  color?: string
  data: any[]
  onOk: (data: {
    column: any,
    order: 'ascend' | 'descend' | undefined,
    field: string, columnKey?: string
  }) => void
}

const ModalSorter: React.FC<ModalFilterProps> = ({
  title = 'Ordenamiento de datos',
  color,
  data = [],
  onOk,
}) => {
  const [column, setColumn] = useState()
  const [selectedOption, setSelectedOption] = useState('')
  const [open, setOpen] = useState(false)

  const handleOk = () => {
    setOpen(false);
    onOk({
      column, order: selectedOption,
      field: column?.dataIndex,
      ...column?.key && { columnKey: column.key }
    })
  }

  const handleCancel = () => setOpen(false)

  return (
    <>
      <button onClick={() => setOpen(true)} className="open-modal">
        <SortAscendingOutlined />
      </button>
      {open && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{title}</h2>
              <button onClick={handleCancel} className="close-button">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div>
                <label>Columnas</label>
                <select
                  value={column}
                  onChange={(e) => setColumn(data.find(item => item.dataIndex === e.target.value))}
                  className="modal-select"
                >
                  <option value="">Escoja columna</option>
                  {data.map((item) => (
                    <option key={item.dataIndex} value={item.dataIndex}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                {column && (
                  <div>
                    <label htmlFor="options">Escoja el orden:</label>
                    <select
                      id="options"
                      value={selectedOption}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="modal-select"
                    >
                      <option value="">--Escoja opción--</option>
                      <option value="ascend">Ascendente</option>
                      <option value="descend">Descendente</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            {column && selectedOption && (
              <div className="modal-footer">
                <button
                  onClick={handleOk}
                  className="modal-button"
                  style={{ background: color || '#007bff' }}
                >
                  OK
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ModalSorter;