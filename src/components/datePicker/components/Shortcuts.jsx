import dayjs from "dayjs";
import React, { useCallback, useContext, useMemo } from "react";

import { DATE_FORMAT, TEXT_COLOR } from "../constants";
import DEFAULT_SHORTCUTS from "../constants/shortcuts";
import DatepickerContext from "../contexts/DatepickerContext";
// import { Period, ShortcutsItem } from "../types";

// interface ItemTemplateProps {
//     children: JSX.Element;
//     key: number;
//     item: ShortcutsItem | ShortcutsItem[];
// }

// eslint-disable-next-line react/display-name
const ItemTemplate = React.memo((props) => {
    const {
        primaryColor,
        period,
        changePeriod,
        updateFirstDate,
        dayHover,
        changeDayHover,
        hideDatepicker,
        changeDatepickerValue
    } = useContext(DatepickerContext);

    // Functions
    const getClassName = useCallback(() => {
        const textColor = TEXT_COLOR["600"][primaryColor]
        const textColorHover = TEXT_COLOR.hover[primaryColor]
        return `whitespace-nowrap w-1/2 md:w-1/3 lg:w-auto transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/10 p-2 rounded cursor-pointer ${textColor} ${textColorHover}`;
    }, [primaryColor]);

    const chosePeriod = useCallback(
        (item) => {
            if (dayHover) {
                changeDayHover(null);
            }
            if (period.start || period.end) {
                changePeriod({
                    start: null,
                    end: null
                });
            }
            changePeriod(item);
            changeDatepickerValue({
                startDate: item.start,
                endDate: item.end
            });
            updateFirstDate(dayjs(item.start))
            hideDatepicker();
        },
        [
            changeDatepickerValue,
            changeDayHover,
            changePeriod,
            dayHover,
            hideDatepicker,
            period.end,
            period.start,
            updateFirstDate
        ]
    );

    const children = props?.children;

    return (
        <li
            className={getClassName()}
            onClick={() => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                chosePeriod(props?.item.period);
            }}
        >
            {children}
        </li>
    );
});

const Shortcuts = () => {
    // Contexts
    const { configs } = useContext(DatepickerContext);

    const callPastFunction = useCallback((data, numberValue) => {
        return typeof data === "function" ? data(numberValue) : null;
    }, []);

    const shortcutOptions = useMemo(() => {
        if (!configs?.shortcuts) {
            return Object.entries(DEFAULT_SHORTCUTS);
        }

        return Object.entries(configs.shortcuts).flatMap(([key, customConfig]) => {
            if (Object.prototype.hasOwnProperty.call(DEFAULT_SHORTCUTS, key)) {
                return [[key, DEFAULT_SHORTCUTS[key]]];
            }

            const { text, period } = customConfig
            if (!text || !period) {
                return [];
            }

            const start = dayjs(period.start);
            const end = dayjs(period.end);

            if (start.isValid() && end.isValid() && (start.isBefore(end) || start.isSame(end))) {
                return [
                    [
                        text,
                        {
                            text,
                            period: {
                                start: start.format(DATE_FORMAT),
                                end: end.format(DATE_FORMAT)
                            }
                        }
                    ]
                ];
            }

            return [];
        });
    }, [configs]);

    const printItemText = useCallback((item) => {
        return item?.text ?? null;
    }, []);

    return shortcutOptions?.length ? (
        <div className="md:border-b mb-3 lg:mb-0 lg:border-r lg:border-b-0 border-gray-300 dark:border-gray-700 pr-1">
            <ul className="w-full tracking-wide flex flex-wrap lg:flex-col pb-1 lg:pb-0">
                {shortcutOptions.map(([key, item], index) =>
                    Array.isArray(item) ? (
                        item.map((item, index) => (
                            <ItemTemplate key={index} item={item}>
                                <>
                                    {key === "past" &&
                                    configs?.shortcuts &&
                                    key in configs.shortcuts &&
                                    item.daysNumber
                                        ? callPastFunction(
                                              configs.shortcuts[key],
                                              item.daysNumber
                                          )
                                        : item.text}
                                </>
                            </ItemTemplate>
                        ))
                    ) : (
                        <ItemTemplate key={index} item={item}>
                            <>
                                {configs?.shortcuts && key in configs.shortcuts
                                    ? typeof configs.shortcuts[
                                          key
                                      ] === "object"
                                        ? printItemText(item)
                                        : configs.shortcuts[key]
                                    : printItemText(item)}
                            </>
                        </ItemTemplate>
                    )
                )}
            </ul>
        </div>
    ) : null;
};

export default Shortcuts;
