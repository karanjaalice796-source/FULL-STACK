import useDataFetching from '../hooks/useDataFetching'

interface ApiUser {
  id: number
  name: string
  username: string
  email: string
  company: {
    name: string
  }
}

const USERS_URL = 'https://jsonplaceholder.typicode.com/users'

export default function UserCacheDemo() {
  const { data, isLoading, error, fetchedAt, refetch, invalidateCache } =
    useDataFetching<ApiUser[]>(USERS_URL, { maxAge: 5 * 60 * 1000 })

  return (
    <div className="cache-demo">
      <div className="cache-toolbar">
        <div className="cache-status">
          <span className={`status-dot ${isLoading ? 'status-loading' : error ? 'status-error' : 'status-ready'}`} />
          {isLoading ? 'Fetching users…' : error ? 'Request failed' : `Cached for 5 minutes · ${data?.length ?? 0} users`}
        </div>
        <div className="cache-actions">
          <button type="button" onClick={() => void refetch()} disabled={isLoading}>Refresh</button>
          <button className="clear-cache-button" type="button" onClick={() => void invalidateCache()} disabled={isLoading}>
            Clear cache & refresh
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="cache-message" role="status">
          <span className="spinner" aria-hidden="true" />
          Connecting to JSONPlaceholder…
        </div>
      )}

      {error && (
        <div className="cache-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => void refetch()}>Try again</button>
        </div>
      )}

      {!isLoading && !error && data && (
        <>
          <div className="users-list">
            {data.map((user, index) => (
              <article className="user-row" key={user.id}>
                <span className={`user-avatar avatar-${(index % 5) + 1}`} aria-hidden="true">
                  {user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                </span>
                <div className="user-info">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
                <span className="user-company">{user.company.name}</span>
              </article>
            ))}
          </div>
          {fetchedAt !== null && (
            <p className="cache-timestamp">
              LAST FETCHED <span>{new Date(fetchedAt).toLocaleTimeString()}</span>
            </p>
          )}
        </>
      )}
    </div>
  )
}
