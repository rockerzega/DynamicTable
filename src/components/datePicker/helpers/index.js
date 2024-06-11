import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(weekday);
dayjs.extend(customParseFormat);

import { DATE_FORMAT, LANGUAGE } from "../constants";

export function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export function getTextColorByPrimaryColor(color) {
    switch (color) {
        case "blue":
            return "text-blue-500";
        case "orange":
            return "text-orange-500";
        case "yellow":
            return "text-yellow-500";
        case "red":
            return "text-red-500";
        case "purple":
            return "text-purple-500";
        case "amber":
            return "text-amber-500";
        case "lime":
            return "text-lime-500";
        case "green":
            return "text-green-500";
        case "emerald":
            return "text-emerald-500";
        case "teal":
            return "text-teal-500";
        case "cyan":
            return "text-cyan-500";
        case "sky":
            return "text-sky-500";
        case "indigo":
            return "text-indigo-500";
        case "violet":
            return "text-violet-500";
        case "fuchsia":
            return "text-fuchsia-500";
        case "pink":
            return "text-pink-500";
        case "rose":
            return "text-rose-500";
        default:
            return "";
    }
}

export function generateArrayNumber(start = 0, end = 0) {
    const array = [];
    for (let i = start; i <= end; i++) {
        array.push(i);
    }

    return array;
}

export function shortString(value, limit = 3) {
    return value.slice(0, limit);
}

export function ucFirst(value) {
    return `${value[0].toUpperCase()}${value.slice(1, value.length)}`;
}

export function formatDate(date, format = DATE_FORMAT) {
    return date.format(format)
}

export function parseFormattedDate(date, format = DATE_FORMAT) {
    return dayjs(date, format);
}

export function getFirstDayInMonth(date) {
    return {
        ddd: formatDate(dayjs(date).startOf("month"), "ddd"),
        basic: formatDate(dayjs(date).startOf("month")),
        object: dayjs(date).startOf("month")
    };
}

export function getLastDayInMonth(date) {
    return {
        ddd: formatDate(dayjs(date).endOf("month"), "ddd"),
        basic: formatDate(dayjs(date).endOf("month")),
        object: dayjs(date).endOf("month")
    };
}

export function getDaysInMonth(date) {
    if (!isNaN(dayjs(date).daysInMonth())) {
        return [...generateArrayNumber(1, dayjs(date).daysInMonth())];
    }
    return [];
}

export function nextMonth(date) {
    return date
        .date(1)
        .hour(0)
        .minute(0)
        .second(0)
        .month(date.month() + 1);
}

export function previousMonth(date) {
    return date
        .date(1)
        .hour(0)
        .minute(0)
        .second(0)
        .month(date.month() - 1);
}

export function getFirstElementsInArray(array = [], size = 0) {
    return array.slice(0, size);
}

export function getLastElementsInArray(array = [], size = 0) {
    const result = [];
    if (Array.isArray(array) && size > 0) {
        if (size >= array.length) {
            return array;
        }

        let y = array.length - 1;
        for (let i = 0; i < size; i++) {
            result.push(array[y]);
            y--;
        }
    }
    return result.reverse();
}

export function getNumberOfDay(dayString, startWeekOn = '') {
    let number = 0;

    let startDateModifier = 0;

    if (startWeekOn) {
        switch (startWeekOn) {
            case "mon":
                startDateModifier = 6;
                break;
            case "tue":
                startDateModifier = 5;
                break;
            case "wed":
                startDateModifier = 4;
                break;
            case "thu":
                startDateModifier = 3;
                break;
            case "fri":
                startDateModifier = 2;
                break;
            case "sat":
                startDateModifier = 1;
                break;
            case "sun":
                startDateModifier = 0;
                break;
            default:
                break;
        }
    }

    ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].forEach(
        (item, index) => {
            if (item.includes(dayString)) {
                number = (index + startDateModifier) % 7;
            }
        }
    );

    return number;
}

export function getLastDaysInMonth(date, size = 0) {
    return getLastElementsInArray(getDaysInMonth(date), size);
}

export function getFirstDaysInMonth(date, size = 0) {
    return getFirstElementsInArray(getDaysInMonth(date), size);
}

export function loadLanguageModule(language = LANGUAGE) {
    switch (language) {
        
        case "en":
            import("dayjs/locale/en");
            break;
        case "es":
            import("dayjs/locale/es");
            break;

        default:
            import("dayjs/locale/en");
            break;
    }
}

export function dateIsValid(date) {
    return date instanceof Date && !isNaN(date.getTime());
}
