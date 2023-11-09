import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { enableMapSet } from "immer";

enableMapSet();

export const useChats = create(
  immer((set) => ({
    chats: [],
    setChats: ({ newChats }) => {
      set((state) => {
        state.chats = newChats;
      });
    },
  }))
);
