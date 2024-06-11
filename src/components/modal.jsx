import React, { useState } from 'react'
import '../css/modal.css'
import Dropdown from './dropdown'
import { FilterOutlined } from '@ant-design/icons'

const CustomModal = ({ title = 'Custom modal', data = [], onOk }) => {
  const [firstSelect, setFirstSelect] = useState('');
  const [secondSelect, setSecondSelect] = useState('');
  const [listFilters, setListFilters] = useState([])
  const [open, setOpen] = useState(false)
  const handleFirstSelectChange = (event) => {
    setFirstSelect(event.target.value)
    setListFilters([])
    if(!event.target.value)
      return
    const { filters } = data.find(item => item.value === event.target.value)
    setListFilters(filters)
  }

  const handleSecondSelectChange = (event) => {
    // const options = event.target.options;
    // const selectedValues = [];
    // for (let i = 0; i < options.length; i++) {
    //   if (options[i].selected) {
    //     selectedValues.push(options[i].value);
    //   }
    // }
    // setSecondSelect(selectedValues);
    if (!event)
      return
    setSecondSelect([event])
  }

  const handleOk = () => {
    console.log('Categoria : ', firstSelect)
    console.log('Filtro : ', secondSelect)
    setOpen(false)
    onOk({firstSelect, secondSelect})
  }
  const handleCancel  = () => setOpen(false)

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
                onChange={handleFirstSelectChange}
                className="modal-select"
              >
                <option value="">Escoja columna</option>
                {data.length > 0 && data.map(item =>
                  (<option value={item.value}>{item.label}</option>)
                )}
              </select>
            </div>
            <div>
              <label>Elija filtro</label>
              <Dropdown data={listFilters} onChange={handleSecondSelectChange}/>
              {/* <select
                value={secondSelect}
                onChange={handleSecondSelectChange}
                className="modal-select"
              >
                <option value="">Escoja filtro</option>
                {listFilters.length > 0 && listFilters.map(item =>
                  (<option value={item.value}>{item.text}</option>)
                )}
              </select> */}
            </div>
          </div>
          <div className="modal-footer">
            <button onClick={handleOk} className="modal-button">OK</button>
            <button onClick={handleCancel} className="modal-button">Cancelar</button>
          </div>
        </div>
      </div>)}
    </>)
}

export default CustomModal;
