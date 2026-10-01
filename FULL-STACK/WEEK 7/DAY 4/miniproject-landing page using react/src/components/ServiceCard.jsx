import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompass, faPenNib, faShapes } from '@fortawesome/free-solid-svg-icons'

const serviceIcons = {
  spark: faShapes,
  web: faCompass,
  story: faPenNib,
}

function ServiceCard({ number, title, description, icon, accent }) {
  return (
    <article className={`service-item accent-${accent}`}>
      <div className="service-meta">
        <span>{number} / 03</span>
        <FontAwesomeIcon icon={serviceIcons[icon]} aria-hidden="true" />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}

export default ServiceCard