import { useEffect, useState } from 'react'

interface User {
  id: number
  name: string
  email: string
  company: {
    name: string
  }
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState<number>(0)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchUsers() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Could not load users (HTTP ${response.status}).`)
        }

        const data: User[] = await response.json()
        setUsers(data)
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
          return
        }

        setError(fetchError instanceof Error ? fetchError.message : 'An unexpected error occurred.')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void fetchUsers()

    return () => controller.abort()
  }, [retryCount])

  return (
    <div className="user-list-preview">
      <div className="user-list-heading">
        <div>
          <p className="micro-label">TEAM DIRECTORY</p>
          <h3>Meet the community</h3>
        </div>
        {!isLoading && !error && <span className="total-count">{users.length} people</span>}
      </div>

      {isLoading && (
        <div className="api-message" role="status">
          <span className="loading-spinner" aria-hidden="true" />
          <span>Fetching the latest people…</span>
        </div>
      )}

      {error && (
        <div className="api-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setRetryCount((count) => count + 1)}>Try again</button>
        </div>
      )}

      {!isLoading && !error && (
        <ul className="user-list">
          {users.map((user, index) => (
            <li className="api-user" key={user.id}>
              <span className={`avatar avatar-tone-${(index % 4) + 1}`} aria-hidden="true">
                {user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
              </span>
              <span className="api-user-details">
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </span>
              <span className="company-tag">{user.company.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
