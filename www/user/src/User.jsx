import { useUser } from "./stores/storeUser.js";
import { useUsers } from "./stores/storeUsers.js";
import { useChats } from "./stores/storeChats.js";
import { useEffect, useState, createContext } from "react";
import useSocketEvents from "./hooks/useSocket.js";
import useQueryURL from "./hooks/useQueryURL.js";
import SideList from "./components/SideList.jsx";
import NavbarContainer from "./components/NavbarContainer.jsx";
import Login from "./components/Login.jsx";
import Chat from "./components/Chat.jsx";
import { callbackManager } from "./utils/utilsApp.js";
import { Divider } from "@nextui-org/react";

const CurrentChatOpened = createContext(undefined);

function User() {
  const { socket, isSocketConnected } = useSocketEvents();
  const { initialize } = useUser();
  const { chats, setChats } = useChats();
  const { setUsers } = useUsers();
  const { idParameter } = useQueryURL("id");
  const [error, setError] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    if (isSocketConnected) {
      socket.emit("user-login", { id: idParameter }, (ret) => {
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
  }, [isSocketConnected, socket, idParameter, initialize, setChats, setUsers]);

  return (
    <>
      {error === undefined ? (
        <></>
      ) : error === null ? (
        <>
          <div className="flex flex-col h-screen">
            <NavbarContainer
              socket={socket}
              isSocketConnected={isSocketConnected}
            />
            <Divider />
            <div className="flex flex-col flex-1 max-h-full">
              <div className="flex-1 flex">
                <CurrentChatOpened.Provider value={currentChat}>
                  <div
                    className="bg-red-200 w-[20%] p-2 overflow-auto "
                    // style={{ maxHeight: "calc(100vh - 64px)" }}
                  >
                    <SideList chats={chats} setCurrentChat={setCurrentChat} />
                  </div>
                  <div
                    className="bg-blue-200 w-[80%] overflow-auto flex flex-col"
                    // style={{ maxHeight: "calc(100vh - 64px)" }}
                  >
                    <Chat idChat={currentChat} socket={socket} />
                  </div>
                </CurrentChatOpened.Provider>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <Login />
        </>
      )}
    </>
  );
}

export default User;
