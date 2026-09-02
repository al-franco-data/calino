import type { JSX } from 'react'
import { useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'

import type { CalendarEvent } from '@/types'
import { useCalendarStore } from '@/store/calendarStore'
import { useSemanticFilterStore } from '@/store/semanticFilterStore'
import { matchesSemanticFilter } from '@/features/semantics/semanticFilter'

import styles from './OccurrenceView.module.css'

function formatOccurrenceDate(event: CalendarEvent): string {
  try {
    return format(parseISO(event.start), 'MMM d, yyyy')
  } catch {
    return event.start
  }
}

function OccurrenceRow({
  event,
  selected,
  onSelect,
}: {
  event: CalendarEvent
  selected: boolean
  onSelect: () => void
}): JSX.Element {
  return (
    <button
      type="button"
      className={`${styles.entryRow} ${selected ? styles.entryRowSelected : ''}`}
      onClick={onSelect}
      data-component="occurrence-entry-row"
    >
      <span className={styles.entryDate}>{formatOccurrenceDate(event)}</span>
      <span className={styles.entryMain}>
        <span className={styles.entryTitle}>{event.title || 'Untitled occurrence'}</span>
        {event.location ? <span className={styles.entryMeta}>{event.location}</span> : null}
      </span>
    </button>
  )
}

export function OccurrenceView(): JSX.Element {
  const events = useCalendarStore((state) => state.events)
  const calendars = useCalendarStore((state) => state.calendars)
  const openModal = useCalendarStore((state) => state.openModal)
  const currentDate = useCalendarStore((state) => state.currentDate)

  const activeSemanticFamily = useSemanticFilterStore((state) => state.activeFamily)
  const activeSemanticKind = useSemanticFilterStore((state) => state.activeKind)
  const selectSemanticKind = useSemanticFilterStore((state) => state.selectKind)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [listOnly, setListOnly] = useState(true)
  const [viewMode, setViewMode] = useState<'month' | 'all'>('month')

  const visibleCalendarIds = useMemo(
    () =>
      new Set(calendars.filter((calendar) => calendar.isVisible).map((calendar) => calendar.id)),
    [calendars]
  )

  const visibleEntries = useMemo(
    () =>
      events
        .filter(
          (event) =>
            event.type !== 'task' &&
            event.type !== 'journal' &&
            visibleCalendarIds.has(event.calendarId) &&
            matchesSemanticFilter(event, activeSemanticFamily, activeSemanticKind)
        )
        .sort((a, b) => a.start.localeCompare(b.start) || a.id.localeCompare(b.id)),
    [events, visibleCalendarIds, activeSemanticFamily, activeSemanticKind]
  )

  const entries = useMemo(
    () =>
      viewMode === 'month'
        ? visibleEntries.filter((event) => event.start.startsWith(currentDate.slice(0, 7)))
        : visibleEntries,
    [currentDate, viewMode, visibleEntries]
  )

  const selectedEntry = selectedId ? entries.find((event) => event.id === selectedId) : undefined

  const heading =
    activeSemanticKind === 'event'
      ? 'Events'
      : activeSemanticKind === 'scaena'
        ? 'Scaena'
        : 'Occurrences'

  const handleSelect = (event: CalendarEvent): void => {
    setSelectedId(event.id)
    setListOnly(false)
    openModal(undefined, undefined, event.id)
  }

  const handleNew = (kind: 'event' | 'scaena'): void => {
    if (activeSemanticKind !== kind) selectSemanticKind(kind)
    setSelectedId(null)
    setListOnly(false)
    openModal()
  }

  return (
    <section className={styles.surface} data-component="occurrence-view">
      <div className={styles.toolbar}>
        <div>
          <h1 className={styles.title}>{heading}</h1>
          <span className={styles.count}>
            {visibleEntries.length} {visibleEntries.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className={styles.actions}>
          <div className={styles.segmentedControl}>
            {(['month', 'all'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                className={`${styles.segmentTab} ${viewMode === mode ? styles.segmentTabActive : ''}`}
                data-component={`occurrence-mode-${mode}`}
                onClick={() => setViewMode(mode)}
              >
                {mode === 'month' ? 'Month' : 'All'}
              </button>
            ))}
          </div>
          {activeSemanticKind === 'event' ? (
            <button type="button" className={styles.addEntry} onClick={() => handleNew('event')}>
              <span aria-hidden="true">+</span> New Event
            </button>
          ) : activeSemanticKind === 'scaena' ? (
            <button type="button" className={styles.addEntry} onClick={() => handleNew('scaena')}>
              <span aria-hidden="true">+</span> New Scaena
            </button>
          ) : (
            <>
              <button type="button" className={styles.addEntry} onClick={() => handleNew('event')}>
                <span aria-hidden="true">+</span> Event
              </button>
              <button type="button" className={styles.addEntry} onClick={() => handleNew('scaena')}>
                <span aria-hidden="true">+</span> Scaena
              </button>
            </>
          )}
        </div>
      </div>

      <div className={`${styles.layout} ${listOnly ? styles.layoutListOnly : ''}`}>
        <aside className={styles.listPane} data-component="occurrence-entry-list">
          <div className={styles.listHeader}>
            {viewMode === 'month'
              ? format(parseISO(`${currentDate.slice(0, 7)}-01`), 'MMMM yyyy')
              : `All ${heading}`}
          </div>

          <div className={styles.listScroll}>
            {entries.length === 0 ? (
              <div className={styles.empty}>
                <h2>No {heading.toLowerCase()}</h2>
                <p>Create one with the button above.</p>
              </div>
            ) : (
              entries.map((event) => (
                <OccurrenceRow
                  key={event.id}
                  event={event}
                  selected={event.id === selectedId}
                  onSelect={() => handleSelect(event)}
                />
              ))
            )}
          </div>
        </aside>

        {!listOnly ? (
          <section className={styles.workPane} data-component="occurrence-work-pane">
            <div className={styles.workPaneInner}>
              <strong>{selectedEntry?.title || 'New occurrence'}</strong>
              <span>Editing is handled by the existing Event editor.</span>
              <button
                type="button"
                className={styles.closePane}
                onClick={() => {
                  setListOnly(true)
                  setSelectedId(null)
                }}
              >
                ×
              </button>
            </div>
          </section>
        ) : null}
      </div>
    </section>
  )
}
