import { useEffect, useState } from 'react'

const categories = ['Personal', 'Work', 'Health', 'Study']

function TaskForm({ task, onClose, onSave }) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [time, setTime] = useState(task?.time ?? '09:00')
  const [category, setCategory] = useState(task?.category ?? 'Personal')
  const [notes, setNotes] = useState(task?.notes ?? '')
  const [error, setError] = useState('')

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  function handleSubmit(event) {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError('Give your task a name before saving.')
      return
    }

    onSave({
      title: trimmedTitle,
      time,
      category,
      notes: notes.trim(),
    })
    onClose()
  }

  return (
    <div
      className="dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section className="task-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <div className="dialog-heading">
          <div>
            <p className="section-kicker">{task ? 'MAKE A CHANGE' : 'MAKE A PLAN'}</p>
            <h2 id="dialog-title">{task ? 'Edit your task' : 'Add to your day'}</h2>
          </div>
          <button className="dialog-close" type="button" aria-label="Close dialog" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="task-title">Task name</label>
          <input
            autoFocus
            id="task-title"
            className="text-field"
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
              if (error) setError('')
            }}
            placeholder="e.g. Morning walk"
            maxLength={100}
            required
          />
          {error && <p className="form-error" role="alert">{error}</p>}

          <div className="field-row">
            <div>
              <label className="field-label" htmlFor="task-time">Time</label>
              <input
                id="task-time"
                className="text-field"
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                required
              />
            </div>
            <div>
              <label className="field-label" htmlFor="task-category">Category</label>
              <select
                id="task-category"
                className="text-field"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((name) => <option key={name}>{name}</option>)}
              </select>
            </div>
          </div>

          <label className="field-label" htmlFor="task-notes">
            Notes <span>Optional</span>
          </label>
          <textarea
            id="task-notes"
            className="text-field notes-field"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Anything you want to remember?"
            maxLength={300}
            rows={3}
          />

          <div className="dialog-actions">
            <button className="cancel-button" type="button" onClick={onClose}>Cancel</button>
            <button className="save-button" type="submit">{task ? 'Save changes' : 'Add to day'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default TaskForm
