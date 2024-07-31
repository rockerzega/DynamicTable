import React from 'react';
import '../css/spinner.css';

const LoadingScreen = ({color = null}) => {
  
  return (
    <div className="loading-screen">
      <div className="spinner"
      style={color ? {borderTop: `16px solid ${color}`} : {borderTop: '16px solid #3498db'}}
      ></div>
      <p>Cargando...</p>
    </div>
  )
}

export default LoadingScreen