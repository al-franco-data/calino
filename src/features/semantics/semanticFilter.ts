import type { CalendarEvent } from '@/types'
import {
  LFP_SEMANTICS,
  type SemanticFamily,
  type SemanticKind,
} from './lfpSemantics'

export function matchesSemanticFilter(
  event: CalendarEvent,
  activeFamily: SemanticFamily | null,
  activeKind: SemanticKind | null
): boolean {
  // No semantic selection: preserve Calino's existing behavior.
  if (!activeFamily && !activeKind) return true

  const concepts = event.concepts ?? []

  // Specific kind selected: its exact CONCEPT is authoritative.
  if (activeKind) {
    const semantic = LFP_SEMANTICS.find((item) => item.kind === activeKind)
    return semantic ? concepts.includes(semantic.concept) : false
  }

  // Family selected: admit either of that family's semantic kinds.
  if (activeFamily) {
    const allowedConcepts = LFP_SEMANTICS
      .filter((item) => item.family === activeFamily)
      .map((item) => item.concept)

    return concepts.some((concept) => allowedConcepts.includes(concept))
  }

  return true
}
