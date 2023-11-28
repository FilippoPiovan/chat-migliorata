import { useState, useEffect } from "react";
import { socket } from "../socket/socket.js";
import { useUser } from "../stores/storeUser.js";
import { useUsers } from "../stores/storeUsers.js";
import { useChats } from "../stores/storeChats.js";

const useSocketEvents = () => {
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const { id } = useUser();
  const { setUsers } = useUsers();
  const { chats, setChats, setMessageToSpecifiedChat } = useChats();

  useEffect(() => {
    const onConnect = () => {
      console.log("onConnect");
      setIsSocketConnected(true);
    };

    const onDisconnect = () => {
      console.log("onDisconnect");
      setIsSocketConnected(false);
    };

    const onUsersUpdated = (allUsers) => {
      setUsers({ users: allUsers, id });
    };

    const onChatsUpdated = () => {
      socket.emit("need-my-chats", id, ({ ret }) => {
        if (ret.status === "ok") {
          setChats({ newChats: ret.chats });
        }
      });
    };

    const onNewMessage = ({ text, idChat, idMessage }) => {
      console.log("onNewMessage: ", text);
      socket.emit("need-messages", { idUser: id, idMessage }, (message) => {
        setMessageToSpecifiedChat({ id: idChat, message });
      });
    };

    socket.on("connect", onConnect);

    socket.on("disconnect", onDisconnect);

    socket.on("user-updated", onUsersUpdated);

    socket.on("chats-updated", onChatsUpdated);

    socket.on("new-message", onNewMessage);

    return () => {
      socket.off("connect", onConnect);

      socket.off("disconnect", onDisconnect);

      socket.off("user-updated", onUsersUpdated);

      socket.off("chats-updated", onChatsUpdated);

      socket.off("new-message", onNewMessage);
    };
  }, [chats, id, setChats, setMessageToSpecifiedChat, setUsers]);

  return { socket, isSocketConnected };
};

export default useSocketEvents;
