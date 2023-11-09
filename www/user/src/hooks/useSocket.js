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

    const onInizializza = (idUtente) => {
      inizializza(idUtente);
    };

    const onUserUpdated = (allUsers) => {
      setUsers({ newUsers: allUsers, id });
    };

    socket.on("connect", onConnect);

    socket.on("disconnect", onDisconnect);

    socket.on("inizializza", onInizializza);

    socket.on("user-updated", onUserUpdated);

    return () => {
      socket.off("connect", onConnect);

      socket.off("disconnect", onDisconnect);

      socket.off("inizializza", onInizializza);

      socket.off("user-updated", onUserUpdated);
    };
  }, [id, inizializza, setUsers]);

  return { socket, isSocketConnected };
};

export default useSocketEvents;
