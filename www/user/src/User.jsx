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
import { Divider } from "@nextui-org/react";

function User() {
  const { socket, isSocketConnected } = useSocketEvents();
  const { setChat, initialize } = useUser();
  const { chats, setChats } = useChats();
  const { setUsers } = useUsers();
  const { idParameter } = useQueryURL("id");
  const [error, setError] = useState(undefined);
  // console.log(error);

  useEffect(() => {
    if (isSocketConnected) {
      socket.emit("user-login", { id: idParameter }, (ret) => {
        // console.log("return: ", ret);
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
          <Divider />
          <div className="">
            <div className="menuChats">
              {chats.map((value, key) => {
                return (
                  <div key={key} className="contenitore">
                    <div className="header">
                      <h1>Chat {value.chatName}</h1>
                    </div>
                    <div className="body">
                      <Messagges
                        messaggi={value.Messages}
                        signleLine={true}
                      ></Messagges>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="chat"></div>
          </div>
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
