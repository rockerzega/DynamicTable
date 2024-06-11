import { createContext } from 'react'
import { DATE_FORMAT, START_WEEK } from '../constants'

const CalendarContext = createContext({
  input: undefined,
  primaryColor: "blue",
  configs: undefined,
  calendarContainer: null,
  arrowContainer: null,
  period: { start: null, end: null },
  changePeriod: period => {},
  hideDatepicker: () => {},
  dayHover: null,
  changeDayHover: (day) => {},
  inputText: "",
  changeInputText: text => {},
  /**
   * Se ejecuta cuando hay un cambio en la fecha de inicio.
   * @param {*} date 
   */
  updateFirstDate: date => {},
  /**
   * se ejecuta cuando hay un cambio en el valor de date picker
   * @param {*} value 
   * @param {*} e 
   */
  changeDatepickerValue: (value, e) => {},
  showFooter: false,
  value: null,
  // i18n: LANGUAGE,
  disabled: false,
  inputClassName: "",
  containerClassName: "",
  toggleClassName: "",
  readOnly: false,
  displayFormat: DATE_FORMAT,
  minDate: null,
  maxDate: null,
  dateLooking: "forward",
  disabledDates: null,
  inputId: undefined,
  inputName: undefined,
  startWeekOn: START_WEEK,
  toggleIcon: undefined,
  classNames: undefined,
  popoverDirection: undefined,
  separator: "~"
})

export default CalendarContext