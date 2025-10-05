import { create } from "zustand";

interface AppState {
  activeProjectId: string | null;
  setActiveProjectId: (projectId: string | null) => void;
  lastGeneratedDraft: string | null;
  setLastGeneratedDraft: (draft: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeProjectId: null,
  setActiveProjectId: (projectId) => set({ activeProjectId: projectId }),
  lastGeneratedDraft: null,
  setLastGeneratedDraft: (draft) => set({ lastGeneratedDraft: draft })
}));
