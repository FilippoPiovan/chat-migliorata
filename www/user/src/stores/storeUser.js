import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { enableMapSet } from "immer";

enableMapSet();

export const useUser = create(
  immer((set) => ({
    id: null,
    online: 0,
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
          { testo: "Placeholder", utente: 2 },
          { testo: "Placeholder", utente: 3 },
          { testo: "Placeholder", utente: 1 },
          { testo: "Placeholder", utente: 2 },
        ],
      },
    ],
    inizializza: (idUtente) => {
      set((state) => {
        state.id = idUtente;
        state.online = 1;
      });
    },
  }))
);
