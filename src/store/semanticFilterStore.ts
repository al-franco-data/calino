import { create } from 'zustand'
import {
  LFP_SEMANTICS,
  type SemanticFamily,
  type SemanticKind,
} from '@/features/semantics/lfpSemantics'

interface SemanticFilterState {
  activeFamily: SemanticFamily | null
  activeKind: SemanticKind | null
  selectFamily: (family: SemanticFamily) => void
  selectKind: (kind: SemanticKind) => void
  clearSelection: () => void
}

export const useSemanticFilterStore = create<SemanticFilterState>((set) => ({
  activeFamily: null,
  activeKind: null,

  selectFamily: (family) =>
    set((state) =>
      state.activeFamily === family && state.activeKind === null
        ? {
            activeFamily: null,
            activeKind: null,
          }
        : {
            activeFamily: family,
            activeKind: null,
          }
    ),

  selectKind: (kind) => {
    const semantic = LFP_SEMANTICS.find((item) => item.kind === kind)

    set((state) =>
      state.activeKind === kind
        ? {
            activeFamily: null,
            activeKind: null,
          }
        : {
            activeFamily: semantic?.family ?? null,
            activeKind: kind,
          }
    )
  },

  clearSelection: () =>
    set({
      activeFamily: null,
      activeKind: null,
    }),
}))
