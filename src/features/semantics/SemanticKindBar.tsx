import { LFP_SEMANTICS, type SemanticFamily, type SemanticKind } from './lfpSemantics'
import styles from './SemanticKindBar.module.css'

const FAMILY_ORDER: readonly SemanticFamily[] = [
  'occurrence',
  'contemplation',
  'duty',
  'record',
  'course',
]

interface SemanticKindBarProps {
  activeFamily?: SemanticFamily | null
  activeKind?: SemanticKind | null
  onFamilySelect?: (family: SemanticFamily) => void
  onKindSelect?: (kind: SemanticKind) => void
}

export function SemanticKindBar({
  activeFamily = null,
  activeKind = null,
  onFamilySelect,
  onKindSelect,
}: SemanticKindBarProps) {
  return (
    <nav
      className={styles.bar}
      aria-label="Los Franco semantic kinds"
      data-component="lfp-semantic-kind-bar"
    >
      {FAMILY_ORDER.map((family) => {
        const kinds = LFP_SEMANTICS.filter((item) => item.family === family)
        const familyLabel = kinds[0]?.familyLabel ?? family

        return (
          <section className={styles.family} key={family}>
            <button
              type="button"
              className={`${styles.familyButton} ${
                activeFamily === family
                  ? activeKind === null
                    ? styles.active
                    : styles.familyContext
                  : ''
              }`}
              onClick={() => onFamilySelect?.(family)}
            >
              {familyLabel}
            </button>

            {kinds.map((item) => (
              <button
                type="button"
                key={item.kind}
                className={`${styles.kindButton} ${
                  activeKind === item.kind
                    ? styles.active
                    : activeFamily === family && activeKind === null
                      ? styles.included
                      : ''
                }`}
                onClick={() => onKindSelect?.(item.kind)}
                title={`${item.carrier} · ${item.concept}`}
              >
                {item.label}
              </button>
            ))}
          </section>
        )
      })}
    </nav>
  )
}
