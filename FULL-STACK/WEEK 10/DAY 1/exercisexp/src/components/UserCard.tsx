interface UserCardProps {
  name?: string
  age?: number
  role?: string
}

export default function UserCard({
  name = 'Alex Morgan',
  age = 28,
  role = 'Frontend developer',
}: UserCardProps) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <article className="user-card-preview">
      <div className="user-card-top">
        <span className="avatar avatar-peach" aria-hidden="true">{initials}</span>
        <span className="online-indicator"><span /> Available</span>
      </div>
      <h3>{name}</h3>
      <p className="user-role">{role}</p>
      <div className="user-card-divider" />
      <div className="user-meta">
        <span>AGE</span>
        <strong>{age}</strong>
      </div>
    </article>
  )
}
