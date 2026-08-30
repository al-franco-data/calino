import ICAL from 'ical.js'

export interface ICalendarScalarPropertyDefinition {
  name: string
  defaultType: string
  repeatable?: boolean
}

/**
 * Register an iCalendar property that ical.js does not yet know about.
 *
 * This promotes a property from opaque preservation to typed understanding
 * without changing Calino's existing preservation of unrelated properties.
 *
 * Suitable for scalar properties, including repeatable properties represented
 * as separate property lines. Structured and delimiter-multivalue properties
 * should use dedicated handlers instead of being forced through this helper.
 */
export function registerScalarProperty(
  definition: ICalendarScalarPropertyDefinition
): void {
  const name = definition.name.toLowerCase()

  if (!ICAL.design.icalendar.property[name]) {
    ICAL.design.icalendar.property[name] = {
      defaultType: definition.defaultType,
    }
  }
}

/**
 * Read all scalar occurrences of a property.
 *
 * A repeatable property such as RFC 9253 CONCEPT is represented as multiple
 * property lines, each carrying one scalar value.
 */
export const CONCEPT_PROPERTY: ICalendarScalarPropertyDefinition = {
  name: 'concept',
  defaultType: 'uri',
  repeatable: true,
}

/**
 * RFC 9253 CONCEPT is a registered iCalendar property whose value is a URI.
 *
 * ical.js 2.2.1 predates awareness of CONCEPT, so register its standard
 * value type explicitly. This same registry can be extended for later
 * standard/IANA properties or private X- properties when Calino chooses
 * to understand them rather than merely preserve them.
 */
registerScalarProperty(CONCEPT_PROPERTY)

export function readScalarProperties(
  component: ICAL.Component,
  propertyName: string
): string[] {
  const values: string[] = []

  for (const prop of component.getAllProperties(propertyName.toLowerCase())) {
    const value = prop.getFirstValue()
    if (typeof value !== 'string') continue

    const trimmed = value.trim()
    if (trimmed.length > 0) values.push(trimmed)
  }

  return values
}

/**
 * Replace all occurrences of a modeled scalar property.
 *
 * Unmodeled properties remain untouched by Calino's existing patch mechanism.
 */
export function writeScalarProperties(
  component: ICAL.Component,
  propertyName: string,
  values: readonly string[]
): void {
  const name = propertyName.toLowerCase()

  component.removeAllProperties(name)

  for (const value of values) {
    const trimmed = value.trim()
    if (!trimmed) continue

    const prop = new ICAL.Property(name, component)
    prop.setValue(trimmed)
    component.addProperty(prop)
  }
}
