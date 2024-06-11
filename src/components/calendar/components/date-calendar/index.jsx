import dayjs from 'dayjs'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import 'dayjs/locale/es'

import { CALENDAR_SIZE, DATE_FORMAT } from '../../constants'
import CalendarContext from '../../context/CalendarContext'
import {
	formatDate,
	getDaysInMonth,
	getFirstDayInMonth,
	getFirstDaysInMonth,
	getLastDaysInMonth,
	getNumberOfDay,
	// loadLanguageModule,
	nextMonth,
	previousMonth
} from '../../helpers'
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	DoubleChevronLeftIcon,
	DoubleChevronRightIcon,
	RoundedButton
} from '../utils'

import Days from './Days'
import Months from './Months'
import Week from './Week'
import Years from './Years'


const DateCalendar = ({
	date,
	minDate,
	maxDate,
	onClickPrevious,
	onClickNext,
	changeMonth,
	changeYear
}) => {
	// Contexts
	const {
		period,
		changePeriod,
		changeDayHover,
		showFooter,
		changeDatepickerValue,
		hideDatepicker,
		asSingle,
		startWeekOn,
		input
	} = useContext(CalendarContext)

	// States
	const [showMonths, setShowMonths] = useState(false);
	const [showYears, setShowYears] = useState(false);
	const [year, setYear] = useState(date.year());
  
	// Functions
	const previous = useCallback(() => {
		return getLastDaysInMonth(
			previousMonth(date),
			getNumberOfDay(getFirstDayInMonth(date).ddd, startWeekOn)
		)
	}, [date, startWeekOn]);

	const current = useCallback(() => {
		return getDaysInMonth(formatDate(date));
	}, [date]);

	const next = useCallback(() => {
		return getFirstDaysInMonth(
			previousMonth(date),
			CALENDAR_SIZE - (previous().length + current().length)
		)
	}, [current, date, previous])

	const hideMonths = useCallback(() => {
		showMonths && setShowMonths(false)
	}, [showMonths])

	const hideYears = useCallback(() => {
			showYears && setShowYears(false)
	}, [showYears])

	const clickMonth = useCallback(
		(month) => {
			setTimeout(() => {
				changeMonth(month);
				setShowMonths(!showMonths);
			}, 250)
		},
		[changeMonth, showMonths]
	)

	const clickYear = useCallback(
			(year) => {
					setTimeout(() => {
							changeYear(year);
							setShowYears(!showYears);
					}, 250);
			},
			[changeYear, showYears]
	);

	const clickDay = useCallback(
			(day, month = date.month() + 1, year = date.year()) => {
					const fullDay = `${year}-${month}-${day}`;
					let newStart;
					let newEnd = null;

					function chosePeriod(start, end) {
							const ipt = input?.current;
							changeDatepickerValue(
									{
											startDate: dayjs(start).format(DATE_FORMAT),
											endDate: dayjs(end).format(DATE_FORMAT)
									},
									ipt
							);
							hideDatepicker();
					}

					if (period.start && period.end) {
							if (changeDayHover) {
									changeDayHover(null);
							}
							changePeriod({
									start: null,
									end: null
							});
					}

					if ((!period.start && !period.end) || (period.start && period.end)) {
							if (!period.start && !period.end) {
									changeDayHover(fullDay);
							}
							newStart = fullDay;
							if (asSingle) {
									newEnd = fullDay;
									chosePeriod(fullDay, fullDay);
							}
					} else {
							if (period.start && !period.end) {
									// start not null
									// end null
									const condition =
											dayjs(fullDay).isSame(dayjs(period.start)) ||
											dayjs(fullDay).isAfter(dayjs(period.start));
									newStart = condition ? period.start : fullDay;
									newEnd = condition ? fullDay : period.start;
							} else {
									// Start null
									// End not null
									const condition =
											dayjs(fullDay).isSame(dayjs(period.end)) ||
											dayjs(fullDay).isBefore(dayjs(period.end));
									newStart = condition ? fullDay : period.start;
									newEnd = condition ? period.end : fullDay;
							}

							if (!showFooter) {
									if (newStart && newEnd) {
											chosePeriod(newStart, newEnd);
									}
							}
					}

					if (!(newEnd && newStart) || showFooter) {
							changePeriod({
									start: newStart,
									end: newEnd
							});
					}
			},
			[
					asSingle,
					changeDatepickerValue,
					changeDayHover,
					changePeriod,
					date,
					hideDatepicker,
					period.end,
					period.start,
					showFooter,
					input
			]
	);

	const clickPreviousDays = useCallback(
			(day) => {
					const newDate = previousMonth(date);
					clickDay(day, newDate.month() + 1, newDate.year());
					onClickPrevious();
			},
			[clickDay, date, onClickPrevious]
	);

	const clickNextDays = useCallback(
			(day) => {
					const newDate = nextMonth(date);
					clickDay(day, newDate.month() + 1, newDate.year());
					onClickNext();
			},
			[clickDay, date, onClickNext]
	);

	// UseEffects & UseLayoutEffect
	useEffect(() => {
			setYear(date.year());
	}, [date]);

	// Variables
	const calendarData = useMemo(() => {
			return {
					date: date,
					days: {
							previous: previous(),
							current: current(),
							next: next()
					}
			};
	}, [current, date, next, previous]);
	const minYear = React.useMemo(
			() => (minDate && dayjs(minDate).isValid() ? dayjs(minDate).year() : null),
			[minDate]
	);
	const maxYear = React.useMemo(
			() => (maxDate && dayjs(maxDate).isValid() ? dayjs(maxDate).year() : null),
			[maxDate]
	);

    return (
			<div className="w-full" style={{ minWidth: '296px', width: '296px' }}>
				<div
					// className="flex items-center flex-row border border-gray-300 rounded-md px-2"
					// style={{ paddingBottom: '0.375rem', paddingTop: '0.375rem', marginLeft: '1rem'}}
					// style={{
					// 	display: 'flex',
					// 	justifyContent: 'space-between',
					// 	alignItems: 'center'
					// }}
				>
					{!showMonths && !showYears && (
						<div style={{ flex: 1 }}>
							<RoundedButton roundedFull={true} onClick={onClickPrevious}>
								<ChevronLeftIcon className="h-5 w-5" />
							</RoundedButton>
						</div>
					)}

					{showYears && (
						<div style={{ flex: 1 }}>
							<RoundedButton
								roundedFull={true}
								onClick={() => {
									setYear(year - 12);
								}}
							>
								<DoubleChevronLeftIcon className="h-5 w-5" />
							</RoundedButton>
						</div>
					)}

					<div style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
						flex: '0 0 auto'
					}}
					>
						<div id="months">
							<RoundedButton
								onClick={() => {
									setShowMonths(!showMonths);
									hideYears();
								}}
							>
								<>{calendarData.date.locale('es').format("MMM")}</>
							</RoundedButton>
						</div>

						<div id="years">
							<RoundedButton
								onClick={() => {
									setShowYears(!showYears);
									hideMonths();
								}}
							>
								<>{calendarData.date.year()}</>
							</RoundedButton>
						</div>
					</div>

					{showYears && (
						<div style={{ flex: 1 }}>
							<RoundedButton
								roundedFull={true}
								onClick={() => {
									setYear(year + 12);
								}}
							>
								<DoubleChevronRightIcon className="h-5 w-5" />
							</RoundedButton>
						</div>
					)}

					{!showMonths && !showYears && (
						<div style={{ flex: 1 }}>
							<RoundedButton roundedFull={true} onClick={onClickNext}>
								<ChevronRightIcon className="h-5 w-5" />
							</RoundedButton>
						</div>
					)}
				</div>

				<div className="px-2 mt-0-5" style={{ minHeight: '285px' }}>
					{showMonths && (
						<Months currentMonth={calendarData.date.month() + 1} clickMonth={clickMonth} />
					)}

					{showYears && (
						<Years
							year={year}
							minYear={minYear}
							maxYear={maxYear}
							currentYear={calendarData.date.year()}
							clickYear={clickYear}
						/>
					)}

					{!showMonths && !showYears && (
						<>
							<Week />

							<Days
								calendarData={calendarData}
								onClickPreviousDays={clickPreviousDays}
								onClickDay={clickDay}
								onClickNextDays={clickNextDays}
							/>
						</>
					)}
				</div>
			</div>
    )
}

export default DateCalendar
