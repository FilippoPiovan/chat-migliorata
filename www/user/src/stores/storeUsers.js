import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { enableMapSet } from "immer";

enableMapSet();

export const useUsers = create(
  immer((set) => ({
    users: [],
    setUsers: ({ newUsers, id }) => {
      set((state) => {
        let indexToDelete = newUsers.findIndex((user) => user.id === id);
        newUsers.splice(indexToDelete, 1);
        state.users = newUsers;
        // let indexToDelete = newUsers.findIndex((user) => user.id === id);
        // state.users = newUsers;
        // state.users.splice(indexToDelete, 1);
      });
    },
  }))
);
