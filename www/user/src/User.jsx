import { useUser } from "./stores/storeUser.js";
import { useEffect } from "react";
import useSocketEvents from "./hooks/useSocket.js";
import useQueryURL from "./hooks/useQueryURL.js";
import Messagges from "./components/Messagges.jsx";
import NavbarContainer from "./components/NavbarContainer.jsx";

function User() {
  const { socket, isSocketConnected } = useSocketEvents();
  const { chats, setChat, setName, inizializza } = useUser();
  const { idParameter } = useQueryURL("id");

  useEffect(() => {
    if (isSocketConnected) {
      socket.emit("user-login", { id: idParameter }, (ret) => {
        switch (ret.status) {
          case "0":
            // l'utente aveva delle chat
            inizializza(idParameter);
            setName(ret.userFromDB.name);
            console.log("setFarloccoChat");
            break;
          case "1":
            // l'utente non aveva delle chat
            inizializza(idParameter);
            setName(ret.userFromDB.name);
            break;
          case "2":
            // l'utente ha sbagliato l'URL
            console.log(ret.error);
            break;
          default:
            console.log("switch case fallito");
            break;
        }
        // inizializza(idParameter, ret.name);
        // // console.log(ret);
        // if (ret.status === "ok") {
        //   // setChat(ret.chats);
        //   console.log("set farlocco chat");
        // }
      });
    }
  }, [isSocketConnected, socket, idParameter, setName, setChat, inizializza]);

  // useEffect(() => {
  // socket.emit("name-changed", { name, id }, (ret) => {
  //   if (ret.status === "ko") {
  //     console.log("aggiornamento del nome non andato a buon fine");
  //   } else {
  //     console.log("aggiornamento del nome andato a buon fine");
  //   }
  // });
  // }, [name, id, socket]);

  return (
    <>
      <NavbarContainer />

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
