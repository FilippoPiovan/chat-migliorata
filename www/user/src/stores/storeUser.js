import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { enableMapSet } from "immer";

enableMapSet();

export const useUser = create(
  immer((set) => ({
    id: null,
    name: "",
    initialize: ({ userId, userName }) => {
      set((state) => {
        state.id = userId;
        state.name = userName;
      });
    },
    setName: (newName) => {
      set((state) => {
        state.name = newName;
      });
    },
  }))
);
