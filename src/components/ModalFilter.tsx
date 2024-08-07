import Dropdown from './Dropdown'
import { Filters, ModalData } from '../types'
import { FilterOutlined } from '@ant-design/icons'
import React, { useState, useRef, useEffect } from 'react'

interface ModalFilterProps {
  title?: string;
  color?: string;
  data: ModalData[];
  onOk: (data: { firstSelect: string; secondSelect: string[] }) => void;
}

const ModalFilter: React.FC<ModalFilterProps> = ({
  title = 'Filtro de datos',
  color,
  data = [],
  onOk,
}) => {
  const [firstSelect, setFirstSelect] = useState<string>('');
  const secondSelect = useRef<string[]>([]);
  const [listFilters, setListFilters] = useState<Filters>([]);
  const [child, setChild] = useState<React.ReactNode>(null);
  const [filOpt, setFilOpt] = useState('none');
  const [open, setOpen] = useState(false);

  const handleSecondSelectChange = (event: string | string[] | null) => {
    if (!event) return;
    secondSelect.current = Array.isArray(event) ? event : [event];
  };

  const handleOk = () => {
    setOpen(false);
    onOk({ firstSelect, secondSelect: secondSelect.current });
  };

  const handleCancel = () => setOpen(false);

  useEffect(() => {
    const selectedData = data.find((item) => item.value === firstSelect);

    if (!selectedData) {
      setListFilters([]);
      setFilOpt('none');
      setChild(null);
      return;
    }

    const { filters, filterDropdown } = selectedData;
    setFilOpt(filters ? 'option' : filterDropdown ? 'child' : 'none');
    setListFilters(filters || []);

    if (filterDropdown) {
      setChild(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        React.cloneElement(filterDropdown as any, {
          setSelectedKeys:
            (keys: string | string[] | null) => handleSecondSelectChange(keys),
          confirm: handleOk,
        })
      );
    } else {
      setChild(null);
    }
  }, [firstSelect, data]);

  return (
    <>
      <button onClick={() => setOpen(true)} className="open-modal">
        <FilterOutlined />
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
                  value={firstSelect}
                  onChange={(e) => setFirstSelect(e.target.value)}
                  className="modal-select"
                >
                  <option value="">Escoja columna</option>
                  {data.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                {filOpt === 'option' && (
                  <>
                    <label>Elija filtro</label>
                    <Dropdown data={listFilters} onChange={handleSecondSelectChange} />
                  </>
                )}
                {filOpt === 'child' && child}
              </div>
            </div>
            {filOpt !== 'none' && filOpt !== 'child' && (
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

export default ModalFilter;