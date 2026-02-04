import { create } from 'zustand';
import type { ParticipantCreate, JobComparison } from './types';

interface ExperimentState {
  // Current step in the flow (1-4)
  currentStep: number;
  setCurrentStep: (step: number) => void;

  // Participant data
  participantData: Partial<ParticipantCreate> | null;
  setParticipantData: (data: Partial<ParticipantCreate>) => void;

  // Participant ID after creation
  participantId: string | null;
  setParticipantId: (id: string) => void;

  // Job comparisons
  comparisons: JobComparison[];
  setComparisons: (comparisons: JobComparison[]) => void;

  // Current comparison index
  currentComparisonIndex: number;
  setCurrentComparisonIndex: (index: number) => void;

  // Comparison responses
  responses: Record<number, 1 | 2>;
  addResponse: (comparisonId: number, selectedJob: 1 | 2) => void;

  // Reset the store
  reset: () => void;
}

const initialState = {
  currentStep: 2, // Start at step 2 (questionnaire)
  participantData: null,
  participantId: null,
  comparisons: [],
  currentComparisonIndex: 0,
  responses: {},
};

export const useExperimentStore = create<ExperimentState>((set) => ({
  ...initialState,

  setCurrentStep: (step) => set({ currentStep: step }),

  setParticipantData: (data) =>
    set((state) => ({
      participantData: { ...state.participantData, ...data },
    })),

  setParticipantId: (id) => set({ participantId: id }),

  setComparisons: (comparisons) => set({ comparisons }),

  setCurrentComparisonIndex: (index) =>
    set({ currentComparisonIndex: index }),

  addResponse: (comparisonId, selectedJob) =>
    set((state) => ({
      responses: { ...state.responses, [comparisonId]: selectedJob },
    })),

  reset: () => set(initialState),
}));
