export const errorManager = ({
  ret,
  idParameter,
  inizializza,
  setName,
  setChat,
  setError,
}) => {
  switch (ret.status) {
    case "0":
      // l'utente aveva delle chat
      inizializza(idParameter);
      setName(ret.userFromDB.name);
      setChat(ret.chats);

      console.log("setFarloccoChat");
      break;
    case "1":
      // l'utente non aveva delle chat
      console.log("utente senza chat");
      inizializza(idParameter);
      setName(ret.userFromDB.name);
      break;
    case "2":
      // l'utente ha sbagliato l'URL
      setError(ret.error);
      break;
    default:
      console.log("switch case fallito");
      break;
  }
};
