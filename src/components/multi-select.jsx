import React, { useState } from 'react'
import '../css/other.css'

const MultiSelect = () => {
  const [isOpen, setIsOpen] = useState(true)
  const selected = []
  const option = true
  return (
    <div className="w-full flex flex-col items-center mx-auto">
      <input name="values" type="hidden" />
      <div className="inline-block relative w-64">
        <div class="flex flex-col items-center relative">
          <div onClick={() => console.log('click')} class="w-full">
            <div className="my-2 p-1 flex border border-gray-200 bg-white rounded">
              <div className="flex flex-auto flex-wrap">
                <template>
                  <div className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-teal-700 bg-teal-100 border border-teal-300">
                  <div className="text-xs font-normal leading-none max-w-full flex-initial"></div>
                    <div className="flex flex-auto flex-row-reverse">
                      <div onClick={() => console.log('remove')}>
                        <svg className="fill-current h-3 w-3 " role="button" viewBox="0 0 20 20">
                          <path d="M14.348,14.849c-0.469,0.469-1.229,0.469-1.697,0L10,11.819l-2.651,3.029c-0.469,0.469-1.229,0.469-1.697,0
                          c-0.469-0.469-0.469-1.229,0-1.697l2.758-3.15L5.651,6.849c-0.469-0.469-0.469-1.228,0-1.697s1.228-0.469,1.697,0L10,8.183
                          l2.651-3.031c0.469-0.469,1.228-0.469,1.697,0s0.469,1.229,0,1.697l-2.758,3.152l2.758,3.15
                          C14.817,13.62,14.817,14.38,14.348,14.849z" />
                        </svg>
                      </div>
                      <div>MultiSelect</div>
                    </div>
                  </div>
                </template>
                {selected.length === 0 && (
                  <div class="flex-1">
                    <input placeholder="Escoja filtro"
                      className="bg-transparent p-1 px-2 appearance-none outline-none h-full w-full text-gray-800"
                    />
                  </div>
                )}
              </div>
              {/**-------------------------------------------------------------- */}
              <div className="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200">
                {isOpen ? (<button type="button" onClick={() => console.log('abrir other')}
                    className="cursor-pointer w-5 h-5 text-gray-600 outline-none">
                    <svg version="1.1" className="fill-current h-3 w-3" viewBox="0 0 20 20">
                        <path d="M17.418,6.109c0.272-0.268,0.709-0.268,0.979,0s0.271,0.701,0,0.969l-7.908,7.83
                                c-0.27,0.268-0.707,0.268-0.979,0l-7.908-7.83c-0.27-0.268-0.27-0.701,0-0.969
                                c0.271-0.268,0.709-0.268,0.979,0L10,13.25L17.418,6.109z" />
                    </svg>

                </button>):
                (<button type="button" onClick={() => console.log('cerrar other')}
                    className="cursor-pointer w-5 h-5 text-gray-600 outline-none">
                    <svg className="fill-current h-3 w-3" viewBox="0 0 20 20">
                        <path d="M2.582,13.891c-0.272,0.268-0.709,0.268-0.979,0s-0.271-0.701,0-0.969l7.908-7.83
c0.27-0.268,0.707-0.268,0.979,0l7.908,7.83c0.27,0.268,0.27,0.701,0,0.969c-0.271,0.268-0.709,0.268-0.978,0L10,6.75L2.582,13.891z
" />
                    </svg>

                </button>)}
              </div>
              {/*-----------------------------------------------------------------*/}
            </div>
          </div>
          <div className="w-full px-4">
            <div className="absolute shadow top-100 bg-white z-40 w-full lef-0 rounded overflow-y-auto"> {/**---div para animación de apertura */}
              <div className="flex flex-col w-full">
                {/* <template> */}
                  <div>
                    <div class="cursor-pointer w-full border-gray-100 rounded-t border-b"
                        onClick={() => console.log('Seleccion item de lista')}>
                      <div class="option.selected ? 'border-teal-600' : ''"
                          className={`flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative ${option ? 'border-teal-600' : ''}`}>
                        <div class="w-full items-center flex">
                          <div class="mx-2 leading-6">Etiqueta</div>
                        </div>
                      </div>
                    </div>
                  </div>
                {/* </template> */}
              </div>
            </div> {/**-------------------fin div animacion */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MultiSelect