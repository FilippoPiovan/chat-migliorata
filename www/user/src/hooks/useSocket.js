import { useState, useEffect } from "react";
import { socket } from "../socket/socket.js";
import { useUser } from "../stores/storeUser.js";
import { useUsers } from "../stores/storeUsers.js";
// import { useChats } from "../stores/storeChats.js";

const useSocketEvents = () => {
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const { id, inizializza } = useUser();
  const { setUsers } = useUsers();

  useEffect(() => {
    const onConnect = () => {
      console.log("onConnect");
      setIsSocketConnected(true);
    };

    const onDisconnect = () => {
      console.log("onDisconnect");
      setIsSocketConnected(false);
    };

    // da aggiungere: chat aggiornate, utenti aggiornati, messaggi aggiornati
    const onInizializza = (idUtente) => {
      inizializza(idUtente);
    };

    const onUserUpdated = (allUsers) => {
      // console.log("utenti aggiornati");
      setUsers({ users: allUsers, id });
    };

    const onChatsUpdated = () => {
      console.log("chats aggiornate, richiedo update");
      socket.emit("need-my-chats", id, (ret) => {
        if (ret.status === "ok") {
          console.log("avevi delle chat");
        } else {
          console.log("non avevi delle chat");
        }
      });
    };

    socket.on("connect", onConnect);

    socket.on("disconnect", onDisconnect);

    socket.on("inizializza", onInizializza);

    socket.on("user-updated", onUserUpdated);

    socket.on("chats-updated", onChatsUpdated);

    return () => {
      socket.off("connect", onConnect);

      socket.off("disconnect", onDisconnect);

      socket.off("inizializza", onInizializza);

      socket.off("user-updated", onUserUpdated);

      socket.off("chats-updated", onChatsUpdated);
    };
  }, [id, inizializza, setUsers]);

  return { socket, isSocketConnected };
};

export default useSocketEvents;
