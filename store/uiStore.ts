import { create } from 'zustand'
import type { UIStore } from '@/types'

export const useUIStore = create<UIStore>((set) => ({
  activeSnippetId: null,
  isShareMenuOpen: false,
  searchQuery: '',
  selectedTags: [],
  visibilityFilter: 'all',
  setActiveSnippet: (id) => set({ activeSnippetId: id }),
  setShareMenuOpen: (open) => set({ isShareMenuOpen: open }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  toggleTag: (tag) =>
    set((state) => ({
      selectedTags: state.selectedTags.includes(tag)
        ? state.selectedTags.filter((t) => t !== tag)
        : [...state.selectedTags, tag],
    })),
  setVisibilityFilter: (v) => set({ visibilityFilter: v }),
  clearFilters: () => set({ searchQuery: '', selectedTags: [], visibilityFilter: 'all' }),
}))
