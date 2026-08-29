export type SemanticFamily =
  | 'occurrence'
  | 'contemplation'
  | 'duty'
  | 'record'
  | 'course'

export type SemanticKind =
  | 'event'
  | 'scaena'
  | 'journal'
  | 'pause-point'
  | 'task'
  | 'cura'
  | 'note'
  | 'memo'
  | 'plan'
  | 'log'

export type ICalendarCarrier = 'VEVENT' | 'VTODO' | 'VJOURNAL'

export interface LfpSemanticKind {
  family: SemanticFamily
  familyLabel: string
  kind: SemanticKind
  label: string
  carrier: ICalendarCarrier
  concept: string
  fallbackPrefix: string | null
}

export const LFP_SEMANTICS: readonly LfpSemanticKind[] = [
  {
    family: 'occurrence',
    familyLabel: 'Occurrence',
    kind: 'event',
    label: 'Event',
    carrier: 'VEVENT',
    concept: 'tag:losfranco.us,2026:occurrence/event',
    fallbackPrefix: null,
  },
  {
    family: 'occurrence',
    familyLabel: 'Occurrence',
    kind: 'scaena',
    label: 'Scaena',
    carrier: 'VEVENT',
    concept: 'tag:losfranco.us,2026:occurrence/scaena',
    fallbackPrefix: 'SCAENA:',
  },
  {
    family: 'contemplation',
    familyLabel: 'Contemplation',
    kind: 'journal',
    label: 'Journal',
    carrier: 'VJOURNAL',
    concept: 'tag:losfranco.us,2026:contemplation/journal',
    fallbackPrefix: null,
  },
  {
    family: 'contemplation',
    familyLabel: 'Contemplation',
    kind: 'pause-point',
    label: 'Pause Point',
    carrier: 'VJOURNAL',
    concept: 'tag:losfranco.us,2026:contemplation/pause-point',
    fallbackPrefix: 'PAUSE POINT:',
  },
  {
    family: 'duty',
    familyLabel: 'Duty',
    kind: 'task',
    label: 'Task',
    carrier: 'VTODO',
    concept: 'tag:losfranco.us,2026:duty/task',
    fallbackPrefix: null,
  },
  {
    family: 'duty',
    familyLabel: 'Duty',
    kind: 'cura',
    label: 'Cura',
    carrier: 'VTODO',
    concept: 'tag:losfranco.us,2026:duty/cura',
    fallbackPrefix: 'CURA:',
  },
  {
    family: 'record',
    familyLabel: 'Record',
    kind: 'note',
    label: 'Note',
    carrier: 'VJOURNAL',
    concept: 'tag:losfranco.us,2026:record/note',
    fallbackPrefix: 'NOTE:',
  },
  {
    family: 'record',
    familyLabel: 'Record',
    kind: 'memo',
    label: 'Memo',
    carrier: 'VJOURNAL',
    concept: 'tag:losfranco.us,2026:record/memo',
    fallbackPrefix: 'MEMO:',
  },
  {
    family: 'course',
    familyLabel: 'Course',
    kind: 'plan',
    label: 'Plan',
    carrier: 'VJOURNAL',
    concept: 'tag:losfranco.us,2026:course/plan',
    fallbackPrefix: 'PLAN:',
  },
  {
    family: 'course',
    familyLabel: 'Course',
    kind: 'log',
    label: 'Log',
    carrier: 'VJOURNAL',
    concept: 'tag:losfranco.us,2026:course/log',
    fallbackPrefix: 'LOG:',
  },
] as const
