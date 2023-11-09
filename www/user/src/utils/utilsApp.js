export const callbackManager = ({
  ret,
  idParameter,
  setError,
  initialize,
  setChats,
  setUsers,
}) => {
  switch (ret.status) {
    case "user-initialization":
      // l'utente si è connesso
      initialize({ userId: idParameter, userName: ret.user.userName });
      ret.chats && ret.chats.length !== 0 && console.log("chat presenti");
      ret.chats && ret.chats.length !== 0 && setChats({ newChats: ret.chats });
      setUsers({ newUsers: ret.allUsers, id: idParameter });
      console.log("inizializzazione utente");
      break;
    case "wrong-url":
      // l'utente ha sbagliato l'URL
      setError(ret.error);
      break;
    default:
      console.log("switch case fallito");
      break;
  }
};
