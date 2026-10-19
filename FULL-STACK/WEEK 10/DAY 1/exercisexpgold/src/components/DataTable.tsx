import { useMemo, useState, type ReactNode } from 'react'

export interface TableColumn<T, K extends keyof T = keyof T> {
  key: K
  title: string
  sortable?: boolean
  render?: (value: T[K], row: T) => ReactNode
}

interface DataTableProps<T extends { id: string | number }> {
  data: T[]
  columns: TableColumn<T>[]
  filterText?: string
  onSelect?: (selectedRows: T[]) => void
}

type SortDirection = 'ascending' | 'descending'

function compareValues(left: unknown, right: unknown): number {
  if (typeof left === 'number' && typeof right === 'number') return left - right
  return String(left ?? '').localeCompare(String(right ?? ''), undefined, {
    numeric: true,
    sensitivity: 'base',
  })
}

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  filterText = '',
  onSelect,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('ascending')
  const [selectedIds, setSelectedIds] = useState<Set<T['id']>>(() => new Set())

  const visibleRows = useMemo(() => {
    const query = filterText.trim().toLocaleLowerCase()
    const filtered = query
      ? data.filter((row) => columns.some((column) =>
          String(row[column.key] ?? '').toLocaleLowerCase().includes(query),
        ))
      : data

    if (sortKey === null) return filtered

    return [...filtered].sort((left, right) => {
      const result = compareValues(left[sortKey], right[sortKey])
      return sortDirection === 'ascending' ? result : -result
    })
  }, [columns, data, filterText, sortDirection, sortKey])

  const allVisibleSelected =
    visibleRows.length > 0 && visibleRows.every((row) => selectedIds.has(row.id))

  function notifySelection(nextIds: Set<T['id']>) {
    setSelectedIds(nextIds)
    onSelect?.(data.filter((row) => nextIds.has(row.id)))
  }

  function toggleRow(id: T['id']) {
    const nextIds = new Set(selectedIds)
    if (nextIds.has(id)) nextIds.delete(id)
    else nextIds.add(id)
    notifySelection(nextIds)
  }

  function toggleAll() {
    const nextIds = new Set(selectedIds)
    if (allVisibleSelected) {
      visibleRows.forEach((row) => nextIds.delete(row.id))
    } else {
      visibleRows.forEach((row) => nextIds.add(row.id))
    }
    notifySelection(nextIds)
  }

  function toggleSort(key: keyof T) {
    if (sortKey === key) {
      setSortDirection((direction) =>
        direction === 'ascending' ? 'descending' : 'ascending',
      )
    } else {
      setSortKey(key)
      setSortDirection('ascending')
    }
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th className="select-column">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={toggleAll}
                aria-label="Select all visible rows"
              />
            </th>
            {columns.map((column) => (
              <th key={String(column.key)} aria-sort={
                sortKey === column.key
                  ? sortDirection === 'ascending' ? 'ascending' : 'descending'
                  : 'none'
              }>
                {column.sortable ? (
                  <button className="sort-button" type="button" onClick={() => toggleSort(column.key)}>
                    {column.title}
                    <span className="sort-indicator" aria-hidden="true">
                      {sortKey === column.key ? (sortDirection === 'ascending' ? '↑' : '↓') : '↕'}
                    </span>
                  </button>
                ) : column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => (
            <tr key={row.id} className={selectedIds.has(row.id) ? 'row-selected' : undefined}>
              <td className="select-column">
                <input
                  type="checkbox"
                  checked={selectedIds.has(row.id)}
                  onChange={() => toggleRow(row.id)}
                  aria-label={`Select row ${row.id}`}
                />
              </td>
              {columns.map((column) => (
                <td key={String(column.key)}>
                  {column.render
                    ? column.render(row[column.key], row)
                    : String(row[column.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
          {visibleRows.length === 0 && (
            <tr><td className="table-empty" colSpan={columns.length + 1}>No matching team members.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
