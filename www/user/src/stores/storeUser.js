import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { enableMapSet } from "immer";

enableMapSet();

export const useUser = create(
  immer((set) => ({
    id: null,
    name: "",
    chats: [],
    users: [],
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
