import { useUser } from "./stores/storeUser.js";
import { useUsers } from "./stores/storeUsers.js";
import { useChats } from "./stores/storeChats.js";
import { useEffect, useState } from "react";
import useSocketEvents from "./hooks/useSocket.js";
import useQueryURL from "./hooks/useQueryURL.js";
import Messagges from "./components/Messagges.jsx";
import NavbarContainer from "./components/NavbarContainer.jsx";
import Error from "./components/Error.jsx";
import { callbackManager } from "./utils/utilsApp.js";

function User() {
  const { socket, isSocketConnected } = useSocketEvents();
  const { id, setChat, initialize } = useUser();
  const { chats, setChats } = useChats();
  const { setUsers } = useUsers();
  const { idParameter } = useQueryURL("id");
  const [error, setError] = useState(undefined);
  // console.log(error);

  useEffect(() => {
    if (isSocketConnected) {
      socket.emit("user-login", { id: idParameter }, (ret) => {
        // console.log(ret);
        callbackManager({
          ret,
          idParameter,
          setError,
          initialize,
          setChats,
          setUsers,
        });
      });
    }
  }, [
    isSocketConnected,
    socket,
    idParameter,
    setChat,
    initialize,
    setChats,
    setUsers,
  ]);

  return (
    <>
      {error === undefined ? (
        <></>
      ) : error === null ? (
        <>
          <NavbarContainer
            socket={socket}
            isSocketConnected={isSocketConnected}
          />
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
          <Error />
        </>
      )}
    </>
  );
}

export default User;
