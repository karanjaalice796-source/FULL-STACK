import useForm, { type FormErrors } from '../hooks/useForm'

interface RegistrationValues extends Record<string, string> {
  name: string
  email: string
  password: string
}

function validateRegistration(values: RegistrationValues): FormErrors<RegistrationValues> {
  const errors: FormErrors<RegistrationValues> = {}

  if (values.name.trim().length < 2) {
    errors.name = 'Please enter at least 2 characters.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (values.password.length < 8) {
    errors.password = 'Use at least 8 characters.'
  } else if (!/[A-Z]/.test(values.password) || !/[0-9]/.test(values.password)) {
    errors.password = 'Include at least one uppercase letter and one number.'
  }

  return errors
}

export default function RegistrationForm() {
  const {
    values,
    errors,
    isSubmitting,
    submitMessage,
    submitError,
    handleChange,
    handleSubmit,
  } = useForm<RegistrationValues>({
    initialValues: { name: '', email: '', password: '' },
    validate: validateRegistration,
    onSubmit: async (formValues) => {
      await new Promise<void>((resolve) => window.setTimeout(resolve, 650))
      if (formValues.email.toLowerCase().endsWith('@error.test')) {
        throw new Error('That email address could not be registered. Try another one.')
      }
    },
  })

  return (
    <form className="registration-form" onSubmit={handleSubmit} noValidate>
      <div className="form-fields">
        <label className="field">
          <span>FULL NAME</span>
          <input
            autoComplete="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="e.g. Jordan Lee"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && <small id="name-error" className="field-error">{errors.name}</small>}
        </label>
        <label className="field">
          <span>EMAIL ADDRESS</span>
          <input
            autoComplete="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && <small id="email-error" className="field-error">{errors.email}</small>}
        </label>
        <label className="field">
          <span>PASSWORD <i>8+ CHARACTERS · 1 UPPERCASE · 1 NUMBER</i></span>
          <input
            autoComplete="new-password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            placeholder="Create a strong password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {errors.password && <small id="password-error" className="field-error">{errors.password}</small>}
        </label>
      </div>

      <button className="primary-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating your account…' : 'Create account'}
        <span aria-hidden="true">↗</span>
      </button>
      <p className="form-feedback" aria-live="polite">
        {submitMessage && <span className="success-message">{submitMessage}</span>}
        {submitError && <span className="error-message">{submitError}</span>}
        {!submitMessage && !submitError && <span>Try <code>@error.test</code> to preview a server error.</span>}
      </p>
    </form>
  )
}
