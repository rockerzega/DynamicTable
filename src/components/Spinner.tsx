import '../css/spinner.css'
import React, { FC } from 'react'

const Spinner: FC<{
  color?: string
}> = ({ color }) => {
  
  return (
    <div className="loading-screen">
      <div className="spinner"
        style = { color
          ? { borderTop: `16px solid ${color}` }
          : { borderTop: '16px solid #3498db' }
        }
      />
      <p>Cargando...</p>
    </div>
  )
}

export default Spinner
