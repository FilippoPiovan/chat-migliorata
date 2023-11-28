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
    setMessageToSpecifiedChat: ({ id, message }) => {
      set((state) => {
        let index = state.chats.findIndex((chat) => {
          return chat.id === id;
        });
        state.chats[index].Messages.push(message);
      });
    },
  }))
);
