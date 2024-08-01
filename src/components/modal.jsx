import React, {useRef, useState, useEffect} from 'react'
import '../css/modal.css'
import Dropdown from './dropdown'
import { FilterOutlined } from '@ant-design/icons'

const CustomModal = ({ title = 'Custom modal', color = null, data = [], onOk }) => {
  const [firstSelect, setFirstSelect] = useState('')
  const secondSelect = useRef([])
  const [listFilters, setListFilters] = useState([])
  const [child, setChild] = useState(null)
  const [filOpt, setFilOpt] = useState('none')
  const [open, setOpen] = useState(false)

  const handleSecondSelectChange = (event) => {
    if (!event)
      return
    secondSelect.current =Array.isArray(event) ? event : [event]
  }

  const handleOk = () => {
    setOpen(false)
    onOk({firstSelect, secondSelect: secondSelect.current})
  }
  const handleCancel  = () => setOpen(false)

  useEffect(() => {
    setListFilters([])
    if(!firstSelect)
      return
    const { filters, filterDropdown } = data.find(item => item.value === firstSelect) || {}
    setFilOpt(filters ? 'option' : filterDropdown ? 'child' : 'none')
    setListFilters(filters ? filters : [])
    setChild( filterDropdown
      ? React.cloneElement(filterDropdown, {
        setSelectedKeys: (keys) => handleSecondSelectChange(keys),
        confirm: () => handleOk(),
      }) 
      : null)
  }, [firstSelect, data])

  return (<>
    <button
      onClick={() => setOpen(true)}
      className="open-modal">{<FilterOutlined />}
    </button>
    {open && (  <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h2>{title}</h2>
            <button onClick={handleCancel} className="close-button">&times;</button>
          </div>
          <div className="modal-body">
            <div>
              <label>Columnas</label>
              <select
                value={firstSelect}
                onChange={(e) => setFirstSelect(e.target.value)}
                className="modal-select"
              >
                <option value="">Escoja columna</option>
                {data.length > 0 && data.map(item =>
                  (<option value={item.value}>{item.label}</option>)
                )}
              </select>
            </div>
            <div>
              {filOpt === 'option' && (<><label>Elija filtro</label>
                <Dropdown data={listFilters} onChange={handleSecondSelectChange}/></>)
              }
              { filOpt === 'child' && child }

            </div>
          </div>
          {!['child', 'none'].includes(filOpt) && (<div className="modal-footer">
            <button onClick={handleOk} className="modal-button"
              style={
                color ? { background: color } : { background: '#007bff' }
              }
            >OK</button>
            {/* <button onClick={handleCancel} className="modal-button">Cancelar</button> */}
          </div>)}
        </div>
      </div>)}
    </>)
}

export default CustomModal;
