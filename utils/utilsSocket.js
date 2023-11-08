import { logger } from "./log.js";

const onAdminLogin = () => {};

const onUserLogin = async ({ user, callback, utilsDB }) => {
  logger.info(`Utente con id ${user.id} sta provando a collegarsi`);
  if (user.id !== null) {
    let { userFromDB, chats } = await utilsDB.connectUser({ userId: user.id });
    if (chats && chats.length !== 0) {
      // logger.info(`${user.id} aveva delle chat`);
      logger.info("Userfromdb: ", userFromDB);
      callback({ status: "0", chats, userFromDB });
    } else {
      // logger.info(`${user.id} non aveva delle chat`);
      callback({ status: "1", userFromDB });
    }
  } else {
    callback({
      status: "2",
      error:
        "Non hai inserito correttamente l'id nell'URL, prova con http://localhost:[porta]/?id=valore",
    });
  }
};

const onNameChanging = async ({ user, callback, utilsDB }) => {
  let res = await utilsDB.changeUsername({ user });
  if (res === "ko") {
    callback({ status: "ko" });
  } else {
    callback({ status: "ok", name: res });
  }
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
    socket.on("name-changed", (user, callback) => {
      onNameChanging({ user, callback, utilsDB });
    });
    socket.on("disconnect", () => {
      socket.removeAllListeners();
      logger.info(`Client disconnesso ${socket.userId}`);
      onLogout({ userId: socket.userId, utilsDB });
    });
  });
}
