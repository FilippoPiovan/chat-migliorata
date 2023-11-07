import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { enableMapSet } from "immer";

enableMapSet();

export const useUser = create(
  immer((set) => ({
    id: null,
    chats: [
      {
        id: 1,
        nome: "Prima superiore",
        messaggi: [
          { testo: "ciao come va?", utente: 2 },
          { testo: "Io tutto bene, tu?", utente: 3 },
          { testo: "Anche io bene grazie", utente: 1 },
          { testo: "Non c'è male, il lavoro è molto figo", utente: 2 },
        ],
      },
      {
        id: 2,
        nome: "Seconda superiore",
        messaggi: [
          { testo: "Placeholder", utente: 20 },
          { testo: "Placeholder", utente: 30 },
          { testo: "Placeholder", utente: 10 },
          { testo: "Placeholder", utente: 8 },
        ],
      },
    ],
    name: "",
    inizializza: (idUtente) => {
      set((state) => {
        state.id = idUtente;
      });
    },
    setName: (newName) => {
      set((state) => {
        state.name = newName;
      });
    },
    setChats: (newChats) => {
      set((state) => {
        state.chats = newChats.dataValues;
      });
    },
  }))
);
