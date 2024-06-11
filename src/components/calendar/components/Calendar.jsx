import Input from './Input'
import dayjs from 'dayjs'
import CalendarContext from '../context/CalendarContext'
import React, { useMemo, useRef, useCallback, useState, createRef } from 'react'
import { COLORS, DATE_FORMAT, DEFAULT_COLOR } from '../constants'
import { formatDate, nextMonth, previousMonth } from '../helpers'
import { Arrow, VerticalDash } from './utils'
import DateCalendar from './date-calendar'

const Calendar = ({
  primaryColor = 'blue',
  value = null,
  onChange,
  useRange = true,
  showFooter = false,
  showShortcuts = false,
  configs = undefined,
  asSingle = false,
  placeholder = null,
  separator = "~",
  startFrom = null,
  disabled = false,
  inputClassName = null,
  containerClassName = null,
  toggleClassName = null,
  toggleIcon = undefined,
  displayFormat = DATE_FORMAT,
  readOnly = false,
  minDate = null,
  maxDate = null,
  dateLooking = "forward",
  disabledDates = null,
  inputId,
  inputName,
  startWeekOn = "sun",
  classNames = undefined,
  popoverDirection = undefined
}) => {

  // Refs
	const arrowRef = useRef(null)
  const containerRef = useRef(null)
  const calendarContainerRef = useRef(null)

  // States
  const [dayHover, setDayHover] = useState(null)
  const [inputText, setInputText] = useState('')
  const [inputRef, setInputRef] = useState(createRef())
  const [firstDate, setFirstDate] = useState(
    startFrom && dayjs(startFrom).isValid() ? dayjs(startFrom) : dayjs()
  )
  const [secondDate, setSecondDate] = useState(nextMonth(firstDate))
  const [period, setPeriod] = useState({
    start: null,
    end: null
  })

  // Callbacks
	const hideDatepicker = useCallback(() => {
    const div = calendarContainerRef.current;
    const arrow = arrowRef.current;
    if (arrow && div && div.classList.contains("block")) {
      div.classList.remove("block");
      div.classList.remove("translate-y-0");
      div.classList.remove("opacity-1");
      div.classList.add("translate-y-4");
      div.classList.add("opacity-0");
      setTimeout(() => {
        div.classList.remove("bottom-full");
        div.classList.add("hidden");
        div.classList.add("mb-2.5");
        div.classList.add("mt-2.5");
        arrow.classList.remove("-bottom-2");
        arrow.classList.remove("border-r");
        arrow.classList.remove("border-b");
        arrow.classList.add("border-l");
        arrow.classList.add("border-t");
      }, 300);
    }
  }, [])
  /**fistDate */
  const firstGotoDate = useCallback(
    (date) => {
      const newDate = dayjs(formatDate(date));
      const reformatDate = dayjs(formatDate(secondDate));
      if (newDate.isSame(reformatDate) || newDate.isAfter(reformatDate)) {
          setSecondDate(nextMonth(date));
      }
      setFirstDate(date);
    },
    [secondDate]
  )
  const previousMonthFirst = useCallback(() => {
    setFirstDate(previousMonth(firstDate))
  }, [firstDate])

  const nextMonthFirst = useCallback(() => {
    firstGotoDate(nextMonth(firstDate))
  }, [firstDate, firstGotoDate])

  const changeFirstMonth = useCallback(
    (month) => {
      firstGotoDate(dayjs(`${firstDate.year()}-${month < 10 ? "0" : ""}${month}-01`))
    },
    [firstDate, firstGotoDate]
  )

  const changeFirstYear = useCallback(
    (year) => {
      firstGotoDate(dayjs(`${year}-${firstDate.month() + 1}-01`))
    },
    [firstDate, firstGotoDate]
  )

  /** End firstDate */

  /** secondDate */
  // const secondGotoDate = useCallback(
  //   (date) => {
  //     const newDate = dayjs(formatDate(date, displayFormat));
  //     const reformatDate = dayjs(formatDate(firstDate, displayFormat));
  //     if (newDate.isSame(reformatDate) || newDate.isBefore(reformatDate)) {
  //         setFirstDate(previousMonth(date));
  //     }
  //     setSecondDate(date);
  //   },
  //   [firstDate, displayFormat]
  // )
  /** End secondDate */

  //Memos
  const safePrimaryColor = useMemo(() => {
    if (COLORS.includes(primaryColor)) {
      return primaryColor
    }
    return DEFAULT_COLOR
  }, [primaryColor])

  const contextValues = useMemo(() => {
    return {
      asSingle,
      primaryColor: safePrimaryColor,
      configs,
      calendarContainer: calendarContainerRef,
      arrowContainer: arrowRef,
      hideDatepicker,
      period,
      changePeriod: (newPeriod) => setPeriod(newPeriod),
      dayHover,
      changeDayHover: (newDay) => setDayHover(newDay),
      inputText,
      changeInputText: (newText) => setInputText(newText),
      updateFirstDate: (newDate) => firstGotoDate(newDate),
      changeDatepickerValue: onChange,
      showFooter,
      placeholder,
      separator,
      value,
      disabled,
      inputClassName,
      containerClassName,
      toggleClassName,
      toggleIcon,
      readOnly,
      displayFormat,
      minDate,
      maxDate,
      dateLooking,
      disabledDates,
      inputId,
      inputName,
      startWeekOn,
      classNames,
      onChange,
      input: inputRef,
      popoverDirection
    }
  }, [
    asSingle,
    safePrimaryColor,
    configs,
    hideDatepicker,
    period,
    dayHover,
    inputText,
    onChange,
    showFooter,
    placeholder,
    separator,
    value,
    disabled,
    inputClassName,
    containerClassName,
    toggleClassName,
    toggleIcon,
    readOnly,
    displayFormat,
    minDate,
    maxDate,
    dateLooking,
    disabledDates,
    inputId,
    inputName,
    startWeekOn,
    classNames,
    inputRef,
    popoverDirection,
    firstGotoDate
  ])

  const containerClassNameOverload = useMemo(() => {
		const defaultContainerClassName = "relative w-full text-gray-700"
		return typeof containerClassName === "function"
			? containerClassName(defaultContainerClassName)
			: typeof containerClassName === "string" && containerClassName !== ""
			? containerClassName
			: defaultContainerClassName
	}, [containerClassName])


  return (
    <CalendarContext.Provider value={contextValues}>
      <div ref={containerRef} className={containerClassNameOverload} >
        <Input setContextRef={setInputRef} />
        <div
          className="transition-all ease-out duration-300 absolute z-10 mt-1p text-sm translate-y-4 opacity-0 hidden"
          ref={calendarContainerRef}
        >
          <Arrow ref={arrowRef} />
          <div
            className="shadow-sm border border-gray-300 px-1 bg-white rounded-lg"
            style={{
              marginTop: '0.625rem',
              paddingBottom: '0.125rem',
              paddingTop: '0.125rem'
            }}
          >
            <div className="flex flex-col lg:flex-row py-2">
              <div
                className={`flex items-stretch flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-1.5 md:pl-1 pr-2 lg:pr-1`}
              >
                <DateCalendar
                  date={firstDate}
                  onClickPrevious={previousMonthFirst}
                  onClickNext={nextMonthFirst}
                  changeMonth={changeFirstMonth}
                  changeYear={changeFirstYear}
                  minDate={minDate}
                  maxDate={maxDate}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalendarContext.Provider>
  )
}

export default Calendar
