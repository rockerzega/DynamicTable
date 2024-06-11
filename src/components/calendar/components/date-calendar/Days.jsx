import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import React, { useCallback, useContext } from "react";

import { BG_COLOR, TEXT_COLOR } from '../../constants'
import CalendarContext from '../../context/CalendarContext'
import { formatDate, nextMonth, previousMonth, classNames as cn } from "../../helpers";

dayjs.extend(isBetween);

const Days = ({
	calendarData,
	onClickPreviousDays,
	onClickDay,
	onClickNextDays
}) => {
	// Contexts
	const {
		primaryColor,
		period,
		changePeriod,
		dayHover,
		changeDayHover,
		minDate,
		maxDate,
		disabledDates
	} = useContext(CalendarContext)

	// Functions
	const currentDateClass = useCallback(
		(item) => {
			const itemDate = `${calendarData.date.year()}-${calendarData.date.month() + 1}-${
					item >= 10 ? item : "0" + item
			}`
			if (formatDate(dayjs()) === formatDate(dayjs(itemDate)))
				return TEXT_COLOR["500"][primaryColor]
			return ''
		},
		[calendarData.date, primaryColor]
	)

	const activeDateData = useCallback(
		(day) => {
			const fullDay = `${calendarData.date.year()}-${calendarData.date.month() + 1}-${day}`;
			let className = "";

			if (dayjs(fullDay).isSame(period.start) && dayjs(fullDay).isSame(period.end)) {
				className = ` ${BG_COLOR["500"][primaryColor]} text-white font-medium rounded-full`;
			} else if (dayjs(fullDay).isSame(period.start)) {
				className = ` ${BG_COLOR["500"][primaryColor]} text-white font-medium ${
					dayjs(fullDay).isSame(dayHover) && !period.end
						? "rounded-full"
						: "rounded-l-full"
				}`
			} else if (dayjs(fullDay).isSame(period.end)) {
				className = ` ${BG_COLOR["500"][primaryColor]} text-white font-medium ${
					dayjs(fullDay).isSame(dayHover) && !period.start
						? "rounded-full"
						: "rounded-r-full"
				}`
			}

			return {
				active: dayjs(fullDay).isSame(period.start) || dayjs(fullDay).isSame(period.end),
				className: className
			}
		},
		[calendarData.date, dayHover, period.end, period.start, primaryColor]
	)

    const hoverClassByDay = useCallback(
			(day) => {
				let className = currentDateClass(day);
				const fullDay = `${calendarData.date.year()}-${calendarData.date.month() + 1}-${
					day >= 10 ? day : "0" + day
				}`;

				if (period.start && period.end) {
					if (dayjs(fullDay).isBetween(period.start, period.end, "day", "[)")) {
						return ` ${BG_COLOR["100"][primaryColor]} ${currentDateClass(
								day
						)} dark:bg-white/10`;
					}
				}

				if (!dayHover) {
					return className;
				}

				if (period.start && dayjs(fullDay).isBetween(period.start, dayHover, "day", "[)")) {
					className = ` ${BG_COLOR["100"][primaryColor]} ${currentDateClass(
						day
					)} dark:bg-white/10`;
				}

				if (period.end && dayjs(fullDay).isBetween(dayHover, period.end, "day", "[)")) {
					className = ` ${BG_COLOR["100"][primaryColor]} ${currentDateClass(
						day
					)} dark:bg-white/10`
				}

				if (dayHover === fullDay) {
					const bgColor = BG_COLOR["500"][primaryColor];
					className = ` transition-all duration-500 text-white font-medium ${bgColor} ${
						period.start ? "rounded-r-full" : "rounded-l-full"
					}`
				}

				return className;
			},
			[calendarData.date, currentDateClass, dayHover, period.end, period.start, primaryColor]
    )

    const isDateTooEarly = useCallback(
			(day, type) => {
				if (!minDate) {
					return false;
				}
				const object = {
					previous: previousMonth(calendarData.date),
					current: calendarData.date,
					next: nextMonth(calendarData.date)
				};
				const newDate = object[type];
				const formattedDate = newDate.set("date", day);
				return dayjs(formattedDate).isSame(dayjs(minDate), "day")
					? false
					: dayjs(formattedDate).isBefore(dayjs(minDate));
			},
			[calendarData.date, minDate]
    );

    const isDateTooLate = useCallback(
			(day, type) => {
				if (!maxDate) {
					return false;
				}
				const object = {
					previous: previousMonth(calendarData.date),
					current: calendarData.date,
					next: nextMonth(calendarData.date)
				}
				const newDate = object[type];
				const formattedDate = newDate.set("date", day);
				return dayjs(formattedDate).isSame(dayjs(maxDate), "day")
					? false
					: dayjs(formattedDate).isAfter(dayjs(maxDate));
			},
			[calendarData.date, maxDate]
    )

    const isDateDisabled = useCallback(
			(day, type) => {
				if (isDateTooEarly(day, type) || isDateTooLate(day, type)) {
						return true;
				}
				const object = {
						previous: previousMonth(calendarData.date),
						current: calendarData.date,
						next: nextMonth(calendarData.date)
				}
				const newDate = object[type];
				const formattedDate = `${newDate.year()}-${newDate.month() + 1}-${
						day >= 10 ? day : "0" + day
				}`

				if (!disabledDates || (Array.isArray(disabledDates) && !disabledDates.length)) {
						return false;
				}

				let matchingCount = 0;
				disabledDates?.forEach(dateRange => {
					if (
						dayjs(formattedDate).isAfter(dateRange.startDate) &&
						dayjs(formattedDate).isBefore(dateRange.endDate)
					) {
						matchingCount++;
					}
					if (
						dayjs(formattedDate).isSame(dateRange.startDate) ||
						dayjs(formattedDate).isSame(dateRange.endDate)
					) {
						matchingCount++;
					}
				})
				return matchingCount > 0
			},
			[calendarData.date, isDateTooEarly, isDateTooLate, disabledDates]
    )

    const buttonClass = useCallback(
			(day, type) => {
				const baseClass = "flex items-center justify-center w-12 h-12 lg:w-10 lg:h-10";
				if (type === "current") {
					return cn(
						baseClass,
						!activeDateData(day).active
							? hoverClassByDay(day)
							: activeDateData(day).className,
						isDateDisabled(day, type) && "line-through"
					)
				}
				return cn(baseClass, isDateDisabled(day, type) && "line-through", "text-gray-400");
			},
			[activeDateData, hoverClassByDay, isDateDisabled]
    )

    const checkIfHoverPeriodContainsDisabledPeriod = useCallback(
			(hoverPeriod) => {
				if (!Array.isArray(disabledDates)) {
					return false;
				}
				for (let i = 0; i < disabledDates.length; i++) {
					if (
						dayjs(hoverPeriod.start).isBefore(disabledDates[i].startDate) &&
						dayjs(hoverPeriod.end).isAfter(disabledDates[i].endDate)
					) {
						return true
					}
				}
				return false
			},
			[disabledDates]
    )

    const getMetaData = useCallback(() => {
        return {
					previous: previousMonth(calendarData.date),
					current: calendarData.date,
					next: nextMonth(calendarData.date)
        }
    }, [calendarData.date])

    const hoverDay = useCallback(
			(day, type) => {
				const object = getMetaData();
				const newDate = object[type];
				const newHover = `${newDate.year()}-${newDate.month() + 1}-${
						day >= 10 ? day : "0" + day
				}`;

				if (period.start && !period.end) {
						const hoverPeriod = { ...period, end: newHover };
						if (dayjs(newHover).isBefore(dayjs(period.start))) {
								hoverPeriod.start = newHover;
								hoverPeriod.end = period.start;
								if (!checkIfHoverPeriodContainsDisabledPeriod(hoverPeriod)) {
										changePeriod({
												start: null,
												end: period.start
										});
								}
						}
						if (!checkIfHoverPeriodContainsDisabledPeriod(hoverPeriod)) {
								changeDayHover(newHover);
						}
				}

				if (!period.start && period.end) {
					const hoverPeriod = { ...period, start: newHover };
					if (dayjs(newHover).isAfter(dayjs(period.end))) {
						hoverPeriod.start = period.end;
						hoverPeriod.end = newHover;
						if (!checkIfHoverPeriodContainsDisabledPeriod(hoverPeriod)) {
							changePeriod({
								start: period.end,
								end: null
							})
						}
					}
					if (!checkIfHoverPeriodContainsDisabledPeriod(hoverPeriod)) {
						changeDayHover(newHover);
					}
				}
			},
			[
				changeDayHover,
				changePeriod,
				checkIfHoverPeriodContainsDisabledPeriod,
				getMetaData,
				period
			]
    )

    const handleClickDay = useCallback(
			(day, type) => {
				function continueClick() {
					if (type === "previous") {
						onClickPreviousDays(day);
					}

					if (type === "current") {
						onClickDay(day);
					}

					if (type === "next") {
						onClickNextDays(day);
					}
				}

				if (disabledDates?.length) {
					const object = getMetaData()
					const newDate = object[type]
					const clickDay = `${newDate.year()}-${newDate.month() + 1}-${
						day >= 10 ? day : "0" + day
					}`;

					if (period.start && !period.end) {
						dayjs(clickDay).isSame(dayHover) && continueClick();
					} else if (!period.start && period.end) {
						dayjs(clickDay).isSame(dayHover) && continueClick();
					} else {
						continueClick();
					}
				} else {
					continueClick();
				}
			},
			[
				dayHover,
				disabledDates?.length,
				getMetaData,
				onClickDay,
				onClickNextDays,
				onClickPreviousDays,
				period.end,
				period.start
			]
    )

	return (
		<div className="grid grid-cols-7 my-1" style={{ rowGap: '0.125rem' }}>
			{calendarData.days.previous.map((item, index) => (
				<button
					type="button"
					key={index}
					disabled={isDateDisabled(item, "previous")}
					className={`${buttonClass(item, "previous")}`}
					onClick={() => handleClickDay(item, "previous")}
					onMouseOver={() => {
							hoverDay(item, "previous");
					}}
				>
					{item}
				</button>
			))}

			{calendarData.days.current.map((item, index) => (
				<button
					type="button"
					key={index}
					disabled={isDateDisabled(item, "current")}
					className={`${buttonClass(item, "current")}`}
					onClick={() => handleClickDay(item, "current")}
					onMouseOver={() => {
						hoverDay(item, "current");
					}}
				>
					{item}
				</button>
			))}

			{calendarData.days.next.map((item, index) => (
				<button
					type="button"
					key={index}
					disabled={isDateDisabled(item, "next")}
					className={`${buttonClass(item, "next")}`}
					onClick={() => handleClickDay(item, "next")}
					onMouseOver={() => {
							hoverDay(item, "next");
					}}
				>
					{item}
				</button>
			))}
		</div>
	)
}

export default Days
