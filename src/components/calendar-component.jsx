import React, { useState, useEffect, useRef } from 'react';

const CalendarComponent = () => {
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [dateFromYmd, setDateFromYmd] = useState('');
  const [dateToYmd, setDateToYmd] = useState('');
  const [outputDateFromValue, setOutputDateFromValue] = useState('');
  const [outputDateToValue, setOutputDateToValue] = useState('');
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [endToShow, setEndToShow] = useState('');
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [blankdays, setBlankdays] = useState([])
  const [noOfDays, setNoOfDays] = useState([])
  const pickerRef = useRef(null)
  const [selecting, setSelecting] = useState(false)

  const DAYS = ['Dom', 'Lun', 'Mar', 'X', 'Jue', 'Vie', 'Sab']
  const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const convertFromYmd = (dateYmd) => {
    const year = Number(dateYmd.substr(0, 4));
    const month = Number(dateYmd.substr(5, 2)) - 1;
    const date = Number(dateYmd.substr(8, 2));
    return new Date(year, month, date);
  };

  const convertToYmd = (dateObject) => {
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const date = dateObject.getDate();
    return `${year}-${('0' + month).slice(-2)}-${('0' + date).slice(-2)}`;
  };

  const isToday = (date) => {
    const today = new Date();
    const d = new Date(year, month, date);
    return today.toDateString() === d.toDateString();
  };

  const isDateFrom = (date) => {
    const d = new Date(year, month, date);
    return dateFrom && d.getTime() === dateFrom.getTime();
  };

  const isDateTo = (date) => {
    const d = new Date(year, month, date);
    return dateTo && d.getTime() === dateTo.getTime();
  };

  const isInRange = (date) => {
    const d = new Date(year, month, date);
    return d > dateFrom && d < dateTo;
  };

  const outputDateValues = () => {
    if (dateFrom) {
      setOutputDateFromValue(convertToYmd(dateFrom))
      setDateFromYmd(convertToYmd(dateFrom));
    }
    if (dateTo) {
      setOutputDateToValue(convertToYmd(dateTo));
      setDateToYmd(convertToYmd(dateTo));
    }
  };

  const setDateValues = () => {
    if (dateFrom) {
      setDateFromYmd(convertToYmd(dateFrom))
    }
    if (dateTo) {
      setDateToYmd(convertToYmd(dateTo))
    }
  }

  const getDateValue = (date, temp) => {
    if (temp && !endToShow) return

    let selectedDate = new Date(year, month, date)
    if (endToShow === 'from') {
      setDateFrom(selectedDate)
      if (!dateTo) {
        setDateTo(selectedDate)
      } else if (selectedDate > dateTo) {
        setEndToShow('to')
        setDateFrom(dateTo)
        setDateTo(selectedDate)
      }
    } else if (endToShow === 'to') {
      setDateTo(selectedDate);
      if (!dateFrom) {
        setDateFrom(selectedDate)
      } else if (selectedDate < dateFrom) {
        setEndToShow('from')
        setDateTo(dateFrom)
        setDateFrom(selectedDate)
      }
    }
  }

  useEffect(() => {
    setDateValues();
    outputDateValues();
    setShowDatepicker(false);
    setEndToShow('');
  }, [dateFrom, dateTo]);

  const getNoOfDays = () => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dayOfWeek = new Date(year, month).getDay();
    const blankDaysArray = [];
    for (let i = 1; i <= dayOfWeek; i++) {
      blankDaysArray.push(i);
    }
    const daysArray = [];
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }
    setBlankdays(blankDaysArray);
    setNoOfDays(daysArray);
  };

  const closeDatepicker = () => {
    setEndToShow('');
    setShowDatepicker(false);
  }

  const outSideClick = (event) => {
    console.log('outside clic')
    if (event.target !== pickerRef.current 
      && !pickerRef.current.contains(event.target)) {
      setShowDatepicker(false);
    }
  }

  const init = () => {
    setSelecting((endToShow === 'to' && dateTo) || (endToShow === 'from' && dateFrom))
    if (!dateFrom && dateFromYmd) {
      setDateFrom(convertFromYmd(dateFromYmd));
    }
    if (!dateTo && dateToYmd) {
      setDateTo(convertFromYmd(dateToYmd));
    }
    if (!dateFrom) {
      setDateFrom(dateTo);
    }
    if (!dateTo) {
      setDateTo(dateFrom)
    }
    const currentDate = endToShow === 'from' && dateFrom ? dateFrom : (endToShow === 'to' && dateTo ? dateTo : new Date());
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    if (month !== currentMonth || year !== currentYear) {
      setMonth(currentMonth)
      setYear(currentYear)
      getNoOfDays()
    }
    setDateValues()
  }
  const keyEsc = (event) => {
    if (event.key === 'Escape') {
      closeDatepicker()
    }
    event.stopPropagation()
  }

  useEffect(() => {
    init()
  }, [month, year])

  useEffect(() => {
    getNoOfDays()
  }, [])

  return (
    <div className="h-screen overflow-hidden flex justify-center">
      <div className="h-screen w-screen flex justify-center bg-blue-100">
        <div className="antialiased sans-serif">
          <div className="container mx-auto px-4 py-2 md:py-10">
            <div>
              <label
                htmlFor="datepicker"
                className="font-bold mt-3 mb-1 text-gray-700 block"
              >
                Seleccione el rango de fechas
              </label>
              <div className="relative" onKeyDown={keyEsc}>
                <div className="inline-flex items-center border rounded-md mt-3 bg-gray-200">
                  <input
                    type="text"
                    onClick={() => {
                      setEndToShow('from')
                      setShowDatepicker(true)
                    }}
                    onBlur={() => {
                      console.log('blur on from')
                      // setShowDatepicker(false)
                    }}
                    value={outputDateFromValue}
                    className={
                      `focus:outline-none border-0 p-2 w-40 rounded-l-md border-r \
                      border-gray-300 ${endToShow === 'from' && 'font-semibold'}`
                    }
                    readOnly
                  />
                  <div className="inline-block px-2 h-full">to</div>
                  <input
                    type="text"
                    onClick={() => { setEndToShow('to'); setShowDatepicker(true); }}
                    value={outputDateToValue && endToShow === 'to' ? outputDateToValue : ''}
                    className={
                      `focus:outline-none border-0 p-2 w-40 rounded-r-md border-l \
                      border-gray-300 ${endToShow === 'to' && 'font-semibold'}`
                    }
                    readOnly
                  />
                </div>
                {showDatepicker && (
                  <div
                    className="bg-white mt-2 rounded-lg shadow p-4 absolute"
                    style={{ width: '17rem' }}
                    ref={pickerRef}
                    // onClick={outSideClick}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-full flex justify-between items-center mb-2">
                        <div>
                          <span
                            className="text-lg font-bold text-gray-800"
                          >
                            {MONTH_NAMES[month]}
                          </span>
                          <span className="ml-1 text-lg text-gray-600 font-normal">
                            {year}
                          </span>
                        </div>
                        <div>
                          <button
                            type="button"
                            className={
                              `transition ease-in-out duration-100 inline-flex \
                              cursor-pointer hover:bg-gray-200 p-1 rounded-full`
                            }
                            onClick={() => {
                              console.log('click')
                              if (month === 0) {
                                setYear(prev => prev--);
                                setMonth(11);
                              } else {
                                setMonth(prev=> prev--);
                              }
                              getNoOfDays();
                            }}>
                            <svg className="h-6 w-6 text-gray-500 inline-flex" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded-full"
                            onClick={() => {
                              if (month === 11) {
                                setYear(year + 1);
                                setMonth(0);
                              } else {
                                setMonth(month + 1);
                              }
                              getNoOfDays();
                            }}>
                            <svg className="h-6 w-6 text-gray-500 inline-flex" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="w-full flex flex-wrap mb-3 -mx-1">
                        {DAYS.map((day, index) => (
                          <div key={index} style={{ width: '14.26%' }} className="px-1">
                            <div className="text-gray-800 font-medium text-center text-xs">{day}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap -mx-1">
                        {blankdays.map((blankday, index) => (
                          <div
                            key={index}
                            style={{ width: '14.28%' }}
                            className="text-center border p-1 border-transparent text-sm"
                          />
                        ))}
                        {noOfDays.map((date, dateIndex) => (
                          <div key={dateIndex} style={{ width: '14.28%' }}>
                            <div
                              onClick={() => getDateValue(date)}
                              onMouseOver={() => getDateValue(date)}
                              className={`p-1 cursor-pointer text-center text-sm leading-none leading-loose transition ease-in-out duration-100 ${
                                isToday(date) ? 'font-bold' : ''
                              } ${
                                isDateFrom(date) ? 'bg-blue-800 text-white rounded-l-full' : ''
                              } ${
                                isDateTo(date) ? 'bg-blue-800 text-white rounded-r-full' : ''
                              } ${
                                isInRange(date) ? 'bg-blue-200' : ''
                              }`}
                            >
                              {date}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;