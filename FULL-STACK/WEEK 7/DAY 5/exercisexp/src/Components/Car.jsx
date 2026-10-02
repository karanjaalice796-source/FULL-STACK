import { useState } from 'react'
import Garage from './Garage.jsx'

function Car({ carInfo }) {
  const [color] = useState('red')

  return (
    <div className="component-output car-output">
      <span className="car-swatch" style={{ backgroundColor: color }} aria-label={`${color} car`} />
      <div>
        <p className="output-label">{carInfo.name}</p>
        <h3>This car is <span>{color}</span> {carInfo.model}</h3>
        <Garage size="small" />
      </div>
    </div>
  )
}

export default Car