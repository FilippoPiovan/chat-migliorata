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
      initialize({ userId: idParameter, userName: ret.user.userName });
      ret.chats &&
        ret.chats.length !== 0 &&
        ret.chats &&
        ret.chats.length !== 0 &&
        setChats({ newChats: ret.chats });
      setUsers({ users: ret.allUsers, id: idParameter });
      setError(null);
      break;
    case "wrong-url":
      setError(ret.error);
      break;
    default:
      console.log("switch case fallito");
      break;
  }
};
