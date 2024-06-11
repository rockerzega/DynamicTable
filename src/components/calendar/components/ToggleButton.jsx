import React from 'react'
import { CloseIcon, DateIcon } from './utils'

const ToggleButton = (e) => {
  return e.isEmpty 
		? <DateIcon className="h-5 w-5" />
		: <CloseIcon className="h-5 w-5" />
}

export default ToggleButton
