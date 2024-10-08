/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { ItemOptions } from '../types'

const Dropdown: React.FC<{
  data: any[],
  onChange?: (data: any) => void
}> = ({ data = [], onChange = () => { } }) => {
  const [options, setOptions] = useState<Array<ItemOptions>>([])
  const [selected, setSelected] = useState<Array<number>>([])
  const [show, setShow] = useState(false)
  useEffect(() => {
    loadOptions()
  }, [data.length])

  const loadOptions = () => {
    if (data.length === 0)
      return
    const options = data.map((option) => ({
      value: option.value,
      text: option.text,
      selected: false
    }))
    setOptions(options)
  }

  const toggleDropdown = () => {
    setShow((prev) => !prev)
    onChange(selectedValues())
  }

  const selectedValues = () => selected.map(
    (index) => options[index].value
  ).join(',')

  const selectOption = (index: number) => {
    const newOptions = [...options];
    newOptions[index].selected = !newOptions[index].selected
    setOptions(newOptions);

    if (newOptions[index].selected) {
      setSelected([...selected, index])
    } else {
      setSelected(selected.filter((i) => i !== index))
    }
    onChange(selectedValues())
  }

  const removeOption = (index: number) => {
    const newOptions = [...options]
    newOptions[index].selected = false
    setOptions(newOptions)
    setSelected(selected.filter((_, i) => i !== index))
  }

  return (
    <div className="w-full flex flex-col items-center mx-auto">
      <form>
        <input name="values" type="hidden" value={selectedValues()} />
        <div className="inline-block relative w-64">
          <div className="flex flex-col items-center relative">
            <div className="w-full">
              <div className="my-2 p-1 flex border border-gray-200 bg-white rounded">
                <div className="flex flex-auto flex-wrap">
                  {selected.map((index) => (
                    <div
                      key={options[index].value}
                      className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-teal-700 bg-teal-100 border border-teal-300"
                    >
                      <div className="text-xs font-normal leading-none max-w-full flex-initial">
                        {options[index].text}
                      </div>
                      <div className="flex flex-auto flex-row-reverse">
                        <div onClick={() => removeOption(index)} className="cursor-pointer">
                          <svg className="fill-current h-6 w-6" role="button" viewBox="0 0 20 20">
                            <path d="M14.348,14.849c-0.469,0.469-1.229,0.469-1.697,0L10,11.819l-2.651,3.029c-0.469,0.469-1.229,0.469-1.697,0
                                    c-0.469-0.469-0.469-1.229,0-1.697l2.758-3.15L5.651,6.849c-0.469-0.469-0.469-1.228,0-1.697s1.228-0.469,1.697,0L10,8.183
                                    l2.651-3.031c0.469-0.469,1.228-0.469,1.697,0s0.469,1.229,0,1.697l-2.758,3.152l2.758,3.15
                                    C14.817,13.62,14.817,14.38,14.348,14.849z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                  {selected.length === 0 ? (
                    <div className="flex-1">
                      <input
                        placeholder="Seleccione un filtro"
                        className="bg-transparent p-1 px-2 appearance-none outline-none h-full w-full text-gray-800"
                        value={selectedValues()}
                        readOnly
                      />
                    </div>
                  ) : null}
                </div>
                <div className="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200 svelte-1l8159u">
                  <button type="button" onClick={toggleDropdown} className="cursor-pointer w-6 h-6 text-gray-600 outline-none">
                    {!show ? (
                      <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                        <path d="M17.418,6.109c0.272-0.268,0.709-0.268,0.979,0s0.271,0.701,0,0.969l-7.908,7.83
                          c-0.27,0.268-0.707,0.268-0.979,0l-7.908-7.83c-0.27-0.268-0.27-0.701,0-0.969c0.271-0.268,0.709-0.268,0.979,0L10,13.25
                          L17.418,6.109z" />
                      </svg>
                    ) : (
                      <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                        <path d="M2.582,13.891c-0.272,0.268-0.709,0.268-0.979,0s-0.271-0.701,0-0.969l7.908-7.83
                          c0.27-0.268,0.707-0.268,0.979,0l7.908,7.83c0.27,0.268,0.27,0.701,0,0.969c-0.271,0.268-0.709,0.268-0.978,0L10,6.75L2.582,13.891z
                          " />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            {show ? (
              <div className="w-full px-4">
                <div className="absolute shadow top-100 bg-white z-40 w-full left-0 rounded max-h-select overflow-y-auto">
                  <div className="flex flex-col w-full">
                    {options.map((option, index) => (
                      <div key={option.value}>
                        <div
                          className="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-teal-100"
                          onClick={() => selectOption(index)}
                        >
                          <div className={`flex w-full items-center p-2 pl-2 border-transparent border-l-2 ${option.selected ? 'border-teal-600' : ''}`}>
                            <div className="w-full items-center flex">
                              <div className="mx-2 leading-6">{option.text}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  )
}

export default Dropdown
