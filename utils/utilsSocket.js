import { logger } from "./log.js";

const onAdminLogin = () => {};

const onUserLogin = async ({ user: userProp, callback, utilsDB }) => {
  logger.info(`Utente con id ${userProp.id} sta provando a collegarsi`);
  if (userProp.id !== null) {
    let { user, chats, allUsers } = await utilsDB.connectUser({
      userId: userProp.id,
    });
    // logger.info(`${user.id} aveva delle chat`);
    console.log("chats al login: ", chats);
    callback({ status: "user-initialization", chats, user, allUsers });
  } else {
    callback({
      status: "wrong-url",
      error:
        "Non hai inserito correttamente l'id nell'URL, prova con http://localhost:[porta]/?id=valore",
    });
  }
};

const onNameChanging = async ({ user, utilsDB }) => {
  await utilsDB.changeUsername({ user });
};

const onCreateChat = async ({ id, data, callback, utilsDB }) => {
  logger.info(`Richiesta creazione nuova chat`);
  // console.log("Dati dentro onCreateChat: ", id, data);
  let ret = await utilsDB.createChat({ id, data });
  // console.log("ret: ", ret);
  ret.length === 0 ? callback({ status: "ko" }) : callback({ status: "ok" });
};

const onNeedMyChats = async ({ id, callback, utilsDB }) => {
  let chats = await utilsDB.getChatsByUserId({ id });
  // let messagesChats = await utilsDB.getMessagesFromChat({ chats });
  chats
    ? callback({ ret: { status: "ok", chats: chats } })
    : callback({ ret: { status: "ko" } });
};

const onLogout = async ({ userId, utilsDB }) => {
  await utilsDB.disconnectUser({ userId });
};

export async function socketEventsHandler(io, utilsDB) {
  io.on("connection", (socket) => {
    socket.on("admin-login", () => {
      // invio informazioni all'admin
    });
    socket.on("user-login", async (user, callback) => {
      await onUserLogin({ user, callback, utilsDB });
      socket.userId = user.id;
    });
    socket.on("name-changed", (user) => {
      onNameChanging({ user, utilsDB });
    });
    socket.on("create-chat", (data, callback) => {
      onCreateChat({ id: socket.userId, data, callback, utilsDB });
    });
    socket.on("need-my-chats", (id, callback) => {
      onNeedMyChats({ id, callback, utilsDB });
    });
    socket.on("disconnect", () => {
      // socket.removeAllListeners();
      logger.info(`Client disconnesso ${socket.userId}`);
      onLogout({ userId: socket.userId, utilsDB });
    });
  });
}
