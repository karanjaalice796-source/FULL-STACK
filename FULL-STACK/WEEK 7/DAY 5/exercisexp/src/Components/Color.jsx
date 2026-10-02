import { useEffect, useState } from 'react'

function Color() {
  const [favoriteColor, setFavoriteColor] = useState('red')

  useEffect(() => {
    window.alert('useEffect reached')
  }, [])

  return (
    <div className="component-output color-output">
      <div className="color-swatch" style={{ backgroundColor: favoriteColor }} aria-hidden="true" />
      <div>
        <p className="output-label">Favorite color</p>
        <h3>My favorite color is <span>{favoriteColor}</span></h3>
        <button className="button button-outline" type="button" onClick={() => setFavoriteColor('blue')}>Change to blue</button>
      </div>
    </div>
  )
}

export default Color