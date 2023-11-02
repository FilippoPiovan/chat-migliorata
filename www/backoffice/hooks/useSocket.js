import { useState, useEffect } from "react";
import { socket } from "../../socket.js";
import { useBackoffice } from "../stores/storeBackoffice.js";

const useSocketEvents = () => {
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const { aggiungiUtente } = useBackoffice();

  useEffect(() => {
    const onConnect = () => {
      console.log("onConnect");
      setIsSocketConnected(true);
    };

    const onDisconnect = () => {
      console.log("onDisconnect");
      setIsSocketConnected(false);
    };

    const onUtenteCollegato = (utente) => {
      console.log("Nuovo utente collegato");
      aggiungiUtente(utente);
    };

    socket.on("connect", onConnect);

    socket.on("disconnect", onDisconnect);

    socket.on("utenteCollegato", onUtenteCollegato);

    return () => {
      socket.off("connect", onConnect);

      socket.off("disconnect", onDisconnect);

      socket.off("utenteCollegato", onUtenteCollegato);
    };
  }, [aggiungiUtente]);

  return { socket, isSocketConnected };
};

export default useSocketEvents;
