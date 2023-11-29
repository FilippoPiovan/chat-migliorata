import { logger } from "./log.js";

const onAdminLogin = () => {};

const onUserLogin = async ({ user: userProp, callback, utilsDB, socket }) => {
  logger.info(`Utente con id ${userProp.id} sta provando a collegarsi`);
  if (userProp.id !== null) {
    let { user, chats, allUsers } = await utilsDB.connectUser({
      userId: userProp.id,
      socketId: socket.id,
    });
    callback({ status: "user-initialization", chats, user, allUsers });
  } else {
    callback({
      status: "wrong-url",
      error:
        "Non hai inserito correttamente l'id nell'URL, prova con http://localhost:[porta]/?id=valore",
    });
  }
  await utilsDB.joinUserToRooms({ id: userProp.id, socket });
};

const onNameChanging = async ({ user, utilsDB }) => {
  await utilsDB.changeUsername({ user });
};

const onCreateChat = async ({ id, data, callback, utilsDB }) => {
  logger.info(`Richiesta creazione nuova chat`);
  let ret = await utilsDB.createChat({ id, data });
  ret.length === 0 ? callback({ status: "ko" }) : callback({ status: "ok" });
};

const onNeedMyChats = async ({ id, callback, utilsDB }) => {
  let chats = await utilsDB.getChatsByUserId({ id });
  chats
    ? callback({ ret: { status: "ok", chats: chats } })
    : callback({ ret: { status: "ko" } });
};

const onSendingMessage = async ({ data, id, callback, utilsDB }) => {
  let stat = await utilsDB.sendMessage({ data, id });
  callback({ status: stat });
};

const onNeedMessages = async ({ idMessage, callback, utilsDB }) => {
  let message = await utilsDB.getMessage(idMessage);
  callback(message);
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
      await onUserLogin({ user, callback, utilsDB, socket });
      socket.userId = user.id;
    });
    socket.on("name-changed", (user) => {
      onNameChanging({ user, utilsDB });
    });
    socket.on("create-chat", async (data, callback) => {
      onCreateChat({ id: socket.userId, data, callback, utilsDB });
    });
    socket.on("need-my-chats", (id, callback) => {
      onNeedMyChats({ id, callback, utilsDB });
    });
    socket.on("sending-message", (data, callback) => {
      onSendingMessage({ data, id: socket.userId, callback, utilsDB });
    });
    socket.on("need-messages", (data, callback) => {
      data.idUser &&
        data.idMessage &&
        onNeedMessages({ idMessage: data.idMessage, callback, utilsDB });
    });
    socket.on("disconnect", () => {
      logger.info(`Client disconnesso ${socket.userId}`);
      onLogout({ userId: socket.userId, utilsDB });
    });
  });
}
