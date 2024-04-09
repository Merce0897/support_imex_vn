import { create } from 'zustand'

interface casState {
    documents: string[],
    setDocuments: (documents: string) => void
}

export const useCasState = create<casState>((set) => ({
    documents: [],
    setDocuments: (documents: string) => {
        set((state) => ({
            documents: [
                ...state.documents,
                documents
            ]
        }))
    }
}))