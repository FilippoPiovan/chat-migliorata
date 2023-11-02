import { useUser } from "./stores/storeUser.js";
import { useEffect } from "react";
import useSocketEvents from "./hooks/useSocket.js";
import useQueryURL from "./hooks/useQueryURL.js";
import Messagges from "./components/Messagges.jsx";

function User() {
  const { socket, isSocketConnected } = useSocketEvents();
  const { id, online, chats } = useUser();
  const { parametroId } = useQueryURL("id");
  useEffect(() => {
    if (isSocketConnected) {
      socket.emit("sonoUtente", parametroId);
    }
  }, [isSocketConnected, socket, parametroId]);

  return (
    <>
      <div>
        <h1>User: {id}</h1>
        <div
          className={
            online === 0
              ? "w-[15px] h-[15px] rounded-xl bg-red-700"
              : "w-[15px] h-[15px] rounded-xl bg-green-700"
          }
        ></div>
      </div>
      <button>Nuova Conversazione</button>
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
      })}
    </>
  );
}

export default User;
