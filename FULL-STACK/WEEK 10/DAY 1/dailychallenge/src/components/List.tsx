import type { ReactNode } from 'react'

interface ListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  getKey: (item: T) => string | number
  emptyMessage?: string
}

export default function List<T>({
  items,
  renderItem,
  getKey,
  emptyMessage = 'Nothing here just yet.',
}: ListProps<T>) {
  if (items.length === 0) {
    return <p className="empty-list">{emptyMessage}</p>
  }

  return (
    <ul className="book-list">
      {items.map((item, index) => (
        <li key={getKey(item)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  )
}
