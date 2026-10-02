import { useState } from 'react'
import Input from './Input.jsx'

const initialValues = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
}

function validate(values) {
  const errors = {}
  const phonePattern = /^\+?[\d\s().-]+$/
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  const phoneDigits = values.phone.replace(/\D/g, '').length

  if (!values.firstName.trim()) errors.firstName = 'First name is required.'
  if (!values.lastName.trim()) errors.lastName = 'Last name is required.'
  if (!values.phone.trim()) {
    errors.phone = 'Phone number is required.'
  } else if (!phonePattern.test(values.phone.trim()) || phoneDigits < 7 || phoneDigits > 15) {
    errors.phone = 'Enter a valid phone number.'
  }
  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  return errors
}

function Form() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setValues((currentValues) => ({ ...currentValues, [name]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }))
    setSubmitted(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validate(values)
    setErrors(validationErrors)
    setSubmitted(Object.keys(validationErrors).length === 0)
  }

  return (
    <section className="ninja-panel form-panel" aria-labelledby="form-title">
      <p className="ninja-kicker">Custom validation</p>
      <h2 id="form-title">Contact details</h2>
      <form className="ninja-form" onSubmit={handleSubmit} noValidate>
        <Input id="first-name" label="First Name" name="firstName" value={values.firstName} onChange={handleChange} error={errors.firstName} autoComplete="given-name" />
        <Input id="last-name" label="Last Name" name="lastName" value={values.lastName} onChange={handleChange} error={errors.lastName} autoComplete="family-name" />
        <Input id="phone" label="Phone" name="phone" value={values.phone} onChange={handleChange} error={errors.phone} inputMode="tel" autoComplete="tel" />
        <Input id="email" label="Email" name="email" value={values.email} onChange={handleChange} error={errors.email} inputMode="email" autoComplete="email" />
        <button className="ninja-submit" type="submit">Validate details <span aria-hidden="true">↗</span></button>
      </form>
      {submitted && <p className="ninja-success" role="status">All details are valid.</p>}
    </section>
  )
}

export default Form
