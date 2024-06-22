import { create } from "zustand";

interface casState {
  documents: string[];
  setDocuments: (documents: string) => void;
}
