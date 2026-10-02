import { useState } from 'react'

function Phone() {
  const [phone, setPhone] = useState({
    brand: 'Samsung',
    model: 'Galaxy S20',
    color: 'black',
    year: 2020,
  })

  const changeColor = () => setPhone((currentPhone) => ({
    ...currentPhone,
    color: currentPhone.color === 'black' ? 'blue' : 'black',
  }))

  return (
    <div className="component-output phone-output">
      <div className={`phone-visual phone-${phone.color}`}>
        <img
          src="https://www.digitalstore.co.ke/cdn/shop/products/Samsung-Galaxy-S11_1024x.jpg?v=1595415567"
          alt={`${phone.color} Samsung Galaxy S20`}
        />
      </div>
      <div className="phone-details">
        <p className="output-label">{phone.brand} / {phone.year}</p>
        <h3>{phone.model}</h3>
        <p className="phone-color">Color <strong>{phone.color}</strong></p>
        <button className="button button-outline" type="button" onClick={changeColor}>
          Change to {phone.color === 'black' ? 'blue' : 'black'}
        </button>
      </div>
    </div>
  )
}

export default Phone