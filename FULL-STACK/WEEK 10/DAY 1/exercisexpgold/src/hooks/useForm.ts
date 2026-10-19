import { useState, type ChangeEvent, type FormEvent } from 'react'

export type FormErrors<T> = Partial<Record<keyof T, string>>

interface UseFormOptions<T> {
  initialValues: T
  validate: (values: T) => FormErrors<T>
  onSubmit: (values: T) => void | Promise<void>
}

export default function useForm<T extends Record<string, string>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors<T>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitError, setSubmitError] = useState('')

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.currentTarget
    const field = name as keyof T

    setValues((currentValues) => ({ ...currentValues, [field]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }))
    setSubmitMessage('')
    setSubmitError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const validationErrors = validate(values)
    setErrors(validationErrors)
    setSubmitMessage('')
    setSubmitError('')

    if (Object.values(validationErrors).some(Boolean)) return

    setIsSubmitting(true)

    try {
      await onSubmit(values)
      setSubmitMessage('Your account is ready. Welcome aboard!')
      setValues(initialValues)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'We could not submit the form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    values,
    errors,
    isSubmitting,
    submitMessage,
    submitError,
    handleChange,
    handleSubmit,
  }
}
