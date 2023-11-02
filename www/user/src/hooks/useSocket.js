import { useState, useEffect } from "react";
import { socket } from "../socket/socket.js";
import { useUser } from "../stores/storeUser.js";

const useSocketEvents = () => {
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const { inizializza } = useUser();

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

    socket.on("connect", onConnect);

    socket.on("disconnect", onDisconnect);

    socket.on("inizializza", onInizializza);

    return () => {
      socket.off("connect", onConnect);

      socket.off("disconnect", onDisconnect);

      socket.off("inizializza", onInizializza);
    };
  }, [inizializza]);

  return { socket, isSocketConnected };
};

export default useSocketEvents;
