import { describe, expect, it } from 'vitest'
import ICAL from 'ical.js'
import {
  readScalarProperties,
  writeScalarProperties,
} from '../icalPropertyRegistry'

const concepts = [
  'tag:losfranco.us,2026:record/note',
  'tag:losfranco.us,2026:record/memo',
]

function makeComponent(kind: 'vevent' | 'vtodo' | 'vjournal'): ICAL.Component {
  const component = new ICAL.Component(kind)
  component.addPropertyWithValue('uid', `test-${kind}@losfranco.us`)
  component.addPropertyWithValue('summary', `Test ${kind}`)
  component.addPropertyWithValue('categories', 'jewelry')
  return component
}

describe('generic scalar CONCEPT property handling', () => {
  for (const kind of ['vevent', 'vtodo', 'vjournal'] as const) {
    it(`writes repeatable CONCEPT values on ${kind.toUpperCase()}`, () => {
      const component = makeComponent(kind)

      writeScalarProperties(component, 'concept', concepts)

      expect(readScalarProperties(component, 'concept')).toEqual(concepts)
      expect(component.getFirstPropertyValue('summary')).toBe(`Test ${kind}`)
      expect(component.getFirstPropertyValue('categories')).toBe('jewelry')
    })

    it(`concepts: [] semantics clear all CONCEPT values on ${kind.toUpperCase()}`, () => {
      const component = makeComponent(kind)

      writeScalarProperties(component, 'concept', concepts)
      expect(readScalarProperties(component, 'concept')).toEqual(concepts)

      writeScalarProperties(component, 'concept', [])

      expect(readScalarProperties(component, 'concept')).toEqual([])
      expect(component.getAllProperties('concept')).toHaveLength(0)

      // Clearing a modeled semantic property must not disturb unrelated data.
      expect(component.getFirstPropertyValue('uid')).toBe(
        `test-${kind}@losfranco.us`
      )
      expect(component.getFirstPropertyValue('summary')).toBe(`Test ${kind}`)
      expect(component.getFirstPropertyValue('categories')).toBe('jewelry')
    })
  }
})
