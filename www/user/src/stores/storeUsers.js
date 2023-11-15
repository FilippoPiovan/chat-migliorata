import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { enableMapSet } from "immer";

enableMapSet();

export const useUsers = create(
  immer((set) => ({
    users: [],
    setUsers: ({ users, id }) => {
      set((state) => {
        // se da errore cambia il nome nel socket
        state.users = users.filter((user) => user.id !== id);
      });
    },
  }))
);
