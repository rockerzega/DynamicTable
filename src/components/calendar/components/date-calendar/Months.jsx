import 'dayjs/locale/es'
import dayjs from 'dayjs'
import React from 'react'
import { MONTHS } from '../../constants'
import { RoundedButton } from '../utils'


const Months = ({ currentMonth, clickMonth }) => {
  return (
    <div className="w-full grid grid-cols-2 gap-2 mt-2 mb-2">
      {MONTHS.map(item => (
        <RoundedButton
          key={item}
          padding="0.75rem"
          onClick={() => {
            clickMonth(item);
          }}
          active={currentMonth === item}
        >
          <>{dayjs(`2022-${item}-01`).locale('es').format("MMM")}</>
        </RoundedButton>
      ))}
    </div>
  )
}

export default Months;
