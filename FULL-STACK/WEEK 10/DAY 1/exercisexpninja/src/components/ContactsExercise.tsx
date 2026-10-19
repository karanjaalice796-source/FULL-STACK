import { useState, type FormEvent } from 'react'
import { useContacts } from '../context/ContactContext'

function ContactList() {
  const { state, dispatch } = useContacts()

  return (
    <ul className="contacts-list">
      {state.contacts.map((contact) => (
        <li className="contact-item" key={contact.id}>
          <span className={`contact-avatar contact-color-${contact.color}`} aria-hidden="true">
            {contact.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
          </span>
          <span className="contact-info"><strong>{contact.name}</strong><span>{contact.email}</span></span>
          <button type="button" className="remove-contact" onClick={() => dispatch({ type: 'removeContact', id: contact.id })} aria-label={`Remove ${contact.name}`}>×</button>
        </li>
      ))}
      {state.contacts.length === 0 && <li className="contacts-empty">Your contact list is empty. Add someone to say hello.</li>}
    </ul>
  )
}

function AddContactForm() {
  const { dispatch } = useContacts()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanName = name.trim()
    const cleanEmail = email.trim()
    if (!cleanName || !cleanEmail) {
      setMessage('Add a name and email to continue.')
      return
    }

    dispatch({
      type: 'addContact',
      contact: {
        id: Date.now(),
        name: cleanName,
        email: cleanEmail,
        color: (Date.now() % 4) + 1,
      },
    })
    setName('')
    setEmail('')
    setMessage(`${cleanName} was added to your contacts.`)
  }

  return (
    <form className="add-contact-form" onSubmit={handleSubmit}>
      <p className="preview-kicker">ADD SOMEONE NEW</p>
      <label className="sr-only" htmlFor="contact-name">Contact name</label>
      <input id="contact-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Their name" maxLength={50} />
      <label className="sr-only" htmlFor="contact-email">Contact email</label>
      <input id="contact-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Their email" maxLength={100} />
      <button className="button-primary" type="submit">Add contact <span aria-hidden="true">＋</span></button>
      <p className="contact-form-message" aria-live="polite">{message || 'Changes are shared through context.'}</p>
    </form>
  )
}

export default function ContactsExercise() {
  return (
    <div className="contacts-demo">
      <div className="contacts-main">
        <div className="contacts-heading">
          <div><p className="preview-kicker">SHARED CONTEXT</p><h3>Your people</h3></div>
          <span className="context-tag"><i /> PROVIDER CONNECTED</span>
        </div>
        <ContactList />
      </div>
      <AddContactForm />
    </div>
  )
}
