import { useUser } from "./stores/storeUser.js";
import { useEffect, useState } from "react";
import useSocketEvents from "./hooks/useSocket.js";
import useQueryURL from "./hooks/useQueryURL.js";
import Messagges from "./components/Messagges.jsx";
import NavbarContainer from "./components/NavbarContainer.jsx";
import { errorManager } from "./utils/utilsApp.js";

function User() {
  const { socket, isSocketConnected } = useSocketEvents();
  const { id, chats, setChat, setName, inizializza } = useUser();
  const { idParameter } = useQueryURL("id");
  const [error, setError] = useState(undefined);
  // console.log(error);

  useEffect(() => {
    if (isSocketConnected) {
      socket.emit("user-login", { id: idParameter }, (ret) => {
        errorManager({
          ret,
          idParameter,
          inizializza,
          setName,
          setChat,
          setError,
        });
      });
    }
  }, [isSocketConnected, socket, idParameter, setName, setChat, inizializza]);

  return (
    <>
      {error === undefined ? (
        <>
          <NavbarContainer />
          <p>Id: {id}</p>
          {chats.map((value, key) => {
            return (
              <div key={key} className="contenitore">
                <div className="header">
                  <h1>{value.nome}</h1>
                </div>
                <div className="body">
                  <Messagges messaggi={value.messaggi}></Messagges>
                </div>
              </div>
            );
          })}{" "}
        </>
      ) : (
        <>
          <h1>Problema</h1>
        </>
      )}
    </>
  );
}

export default User;
