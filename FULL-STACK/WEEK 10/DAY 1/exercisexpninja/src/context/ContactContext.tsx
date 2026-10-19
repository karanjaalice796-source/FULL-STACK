import { createContext, useContext, useReducer, type ReactNode } from 'react'

export interface Contact {
  id: number
  name: string
  email: string
  color: number
}

interface ContactState {
  contacts: Contact[]
}

type ContactAction =
  | { type: 'addContact'; contact: Contact }
  | { type: 'removeContact'; id: number }

interface ContactContextValue {
  state: ContactState
  dispatch: React.Dispatch<ContactAction>
}

const initialState: ContactState = {
  contacts: [
    { id: 1, name: 'Avery Brooks', email: 'avery@example.com', color: 1 },
    { id: 2, name: 'Kai Morgan', email: 'kai@example.com', color: 2 },
    { id: 3, name: 'Riley James', email: 'riley@example.com', color: 3 },
  ],
}

function contactReducer(state: ContactState, action: ContactAction): ContactState {
  switch (action.type) {
    case 'addContact':
      return { contacts: [...state.contacts, action.contact] }
    case 'removeContact':
      return { contacts: state.contacts.filter((contact) => contact.id !== action.id) }
  }
}

const ContactContext = createContext<ContactContextValue | undefined>(undefined)

export function ContactProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(contactReducer, initialState)

  return (
    <ContactContext.Provider value={{ state, dispatch }}>
      {children}
    </ContactContext.Provider>
  )
}

export function useContacts(): ContactContextValue {
  const context = useContext(ContactContext)
  if (!context) {
    throw new Error('useContacts must be used within a ContactProvider.')
  }
  return context
}
