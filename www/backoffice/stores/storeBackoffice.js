import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { enableMapSet } from "immer";

enableMapSet();

export const useBackoffice = create(
  immer((set) => ({
    users: [],
    chats: [],
    aggiungiUtente: (utente) =>
      set((state) => {
        console.log(state);
        console.log("Aggiungere un nuovo utente: ", utente);
      }),
  }))
);
