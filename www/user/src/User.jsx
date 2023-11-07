import { useUser } from "./stores/storeUser.js";
import { useEffect } from "react";
import useSocketEvents from "./hooks/useSocket.js";
import useQueryURL from "./hooks/useQueryURL.js";
import Messagges from "./components/Messagges.jsx";

function User() {
  const { socket, isSocketConnected } = useSocketEvents();
  const { id, chats, name, setName, setChat, inizializza } = useUser();
  const { idParameter } = useQueryURL("id");

  useEffect(() => {
    if (isSocketConnected) {
      socket.emit("user-login", { id: idParameter }, (ret) => {
        inizializza(idParameter);
        console.log(ret);
        if (ret.status === "ok") {
          // setChat(ret.chats);
          console.log("set farlocco chat");
        }
      });
    }
  }, [isSocketConnected, socket, idParameter, setChat, inizializza]);

  useEffect(() => {
    socket.emit("name-changed", { name, id }, (ret) => {
      if (ret.status === "ko") {
        console.log("aggiornamento del nome non andato a buon fine");
      } else {
        console.log("aggiornamento del nome andato a buon fine");
      }
    });
  }, [name, id, socket]);

  return (
    <>
      <div>
        <h1>User: {id}</h1>
        <div
          className={
            isSocketConnected === 0
              ? "w-[15px] h-[15px] rounded-xl bg-red-700"
              : "w-[15px] h-[15px] rounded-xl bg-green-700"
          }
        ></div>
      </div>
      <>
        <input
          type="text"
          onChange={(e) => {
            setName(e.target.value);
          }}
          placeholder="Inserisci il tuo nome"
          value={name}
        ></input>
      </>
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
