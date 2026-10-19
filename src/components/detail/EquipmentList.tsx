import { useId, useState } from 'react'
import { cn } from '../../lib/cn'
import { Button } from '../Button'
import { CheckIcon } from '../icons'

export interface EquipmentListProps {
  items: string[]
  /** Elementos visibles en móvil antes de «Ver todo»; en escritorio se ven todos. */
  collapsedCount?: number
}

export function EquipmentList({ items, collapsedCount = 6 }: EquipmentListProps) {
  const [expanded, setExpanded] = useState(false)
  const listId = useId()
  const collapsible = items.length > collapsedCount

  return (
    <>
      <ul id={listId} className="flex flex-col gap-3 lg:grid lg:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] lg:gap-x-6 lg:gap-y-3.5">
        {items.map((item, i) => (
          <li
            key={item}
            className={cn(
              'flex items-center gap-2.5 text-sm font-semibold text-ink-2 lg:gap-3 lg:text-[15px]',
              collapsible && !expanded && i >= collapsedCount && 'max-lg:hidden',
            )}
          >
            <span className="flex size-6 flex-none items-center justify-center rounded-[7px] bg-accent-soft text-accent lg:size-7 lg:rounded-lg">
              <CheckIcon size={14} strokeWidth={2.8} />
            </span>
            {item}
          </li>
        ))}
      </ul>
      {collapsible && (
        <Button
          variant="secondary"
          block
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((v) => !v)}
          className="mt-3.5 lg:hidden"
        >
          {expanded ? 'Ver menos' : `Ver todo el equipamiento (${items.length})`}
        </Button>
      )}
    </>
  )
}
