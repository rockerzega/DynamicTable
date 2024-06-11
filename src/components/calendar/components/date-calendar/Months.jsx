import dayjs from "dayjs";
import React, { useContext, useEffect } from "react";
import 'dayjs/locale/es'

import { MONTHS } from "../../constants";
// import DatepickerContext from "../../contexts/DatepickerContext";
// import { loadLanguageModule } from  '../../helpers'
import { RoundedButton } from "../utils";

// interface Props {
//     currentMonth: number;
//     clickMonth: (month: number) => void;
// }

const Months = ({ currentMonth, clickMonth }) => {
    // const { i18n } = useContext(DatepickerContext);

    // useEffect(() => {loadLanguageModule('es')}, [])
    return (
        <div className="w-full grid grid-cols-2 gap-2 mt-2 mb-2">
            {MONTHS.map(item => (
                <RoundedButton
                    key={item}
                    padding="py-3"
                    onClick={() => {
                        clickMonth(item);
                    }}
                    active={currentMonth === item}
                >
                    <>{dayjs(`2022-${item}-01`).locale('es').format("MMM")}</>
                </RoundedButton>
            ))}
        </div>
    );
};

export default Months;
