import { logger } from "./log.js";

const onAdminLogin = () => {};

const onUserLogin = async ({ user, callback, utilsDB }) => {
  logger.info(`Utente con id ${user.id} sta provando a collegarsi`);
  let chats = await utilsDB.connectUser({ userId: user.id });
  if (chats && chats.length !== 0) {
    // logger.info(`${user.id} aveva delle chat`);
    callback({ status: "ok", chats });
  } else {
    // logger.info(`${user.id} non aveva delle chat`);
    callback({ status: "ko" });
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
