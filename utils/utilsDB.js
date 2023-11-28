import { DataTypes, Sequelize, Op } from "sequelize";
import { logger } from "./log.js";
import { io } from "../server-index.js";
import { socket } from "../www/user/src/socket/socket.js";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db/chat.db",
  logging: false,
});

try {
  await sequelize.authenticate();
  logger.info("Connessione al DB avvenuta con successo");
} catch (error) {
  throw new Error("Impossibile connettersi al DB: " + error);
}

const User = sequelize.define("User", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  userName: {
    type: DataTypes.STRING,
    defaultValue: "User",
  },
  online: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  socket: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Chat = sequelize.define("Chat", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  chatName: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
});

const Message = sequelize.define("Message", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "Scrivi per mandare un messaggio",
  },
});

const UserChat = sequelize.define("UserChat");

Message.belongsTo(User);
User.hasMany(Message);
Message.belongsTo(Chat);
Chat.hasMany(Message);

User.belongsToMany(Chat, { through: UserChat });
Chat.belongsToMany(User, { through: UserChat });

User.afterCreate(async () => {
  logger.info("utente creato");
  io.emit("user-updated", await getAllUsers({ who: "all" }));
});

User.afterDestroy(async () => {
  logger.info("utente distrutto");
  io.emit("user-updated", await getAllUsers({ who: "all" }));
});

User.afterUpdate(async () => {
  logger.info("utente aggiornato");
  io.emit("user-updated", await getAllUsers({ who: "all" }));
});

Chat.afterCreate(async () => {
  logger.info("chat creata");
});

Chat.afterUpdate(async () => {
  logger.info("chat modificata");
});

Chat.afterDestroy(async () => {
  logger.info("chat distrutta");
});

UserChat.afterBulkCreate(async (userChat) => {
  // dopo che una chat è stata creata non è un bene che tutti possano vedere tutte le chat perché devo mandarlo solo a pochi utenti
  // mando un "ping" a tutti gli utenti che risponderanno nel canale "need-my-chats"
  logger.warn("UserChats creati");

  joinUsersToRoom(userChat);
  // serve solo per avvisare tutti che una chat è stata modificata (senza specificare quale)
  io.emit("chats-updated");
});

Message.afterCreate(async (message) => {
  logger.info("nuovo messaggio");
  io.to(message.dataValues.ChatId).emit("new-message", {
    text: message.dataValues.text,
    idChat: message.dataValues.ChatId,
    idMessage: message.dataValues.id,
  });
});

Message.afterUpdate(async () => {
  logger.warn("messaggio modificato");
});

Message.afterDestroy(async () => {
  logger.info("messaggio eliminato");
});

const synchronizeDB = async () => {
  let ret = false;
  try {
    await sequelize.sync();
    ret = true;
    logger.info("SINCRONIZZAZZIONE AVVENUTA CON SUCCESSO");
  } catch (error) {
    logger.error(error);
  } finally {
    return ret;
  }
};

const setAllUsersDisconnected = async () => {
  let ret = false;
  try {
    await User.update({ online: 0 }, { where: { online: 1 } });
    await User.update({ socket: "" }, { where: {} });
    logger.info("Utenti resettati");
    ret = true;
  } catch (error) {
    logger.error(error);
  } finally {
    return ret;
  }
};

const connectUser = async ({ userId, socketId }) => {
  let chats = [];
  let randomName = `User#${Math.round(Math.random() * 999999)}`;
  let [userDB, created] = await User.findOrCreate({
    where: { id: userId },
    defaults: {
      id: userId,
      online: 1,
      userName: randomName,
      socket: socketId,
    },
  });
  if (!created) {
    userDB.online = 1;
    userDB.socket = socketId;
    await userDB.save();
    chats = await getChatsByUserId({ id: userId });
  }
  let allUsers = await getAllUsers({
    who: "all",
  });
  return { user: userDB.dataValues, chats, allUsers };
};

const joinUsersToRoom = async (userChat) => {
  let userChatDataValues = await getDataValuesFromObject({ objects: userChat });
  let socketsOfUsers = await User.findAll({
    attributes: ["id"],
    where: { socket: { [Op.not]: "" } },
    include: {
      model: Chat,
      through: UserChat,
      attributes: [],
      where: { id: userChatDataValues[0].ChatId },
    },
  });
  socketsOfUsers = await getDataValuesFromObject({ objects: socketsOfUsers });
  io.sockets.sockets.forEach((socket) => {
    socketsOfUsers.find((socketOfUser) => socketOfUser.socket === socket.id) &&
      socket.join(userChatDataValues[0].ChatId);
  });
};

const joinUserToRooms = async ({ id, socket }) => {
  let chats = await Chat.findAll({
    attributes: ["id"],
    include: {
      model: User,
      through: UserChat,
      where: {
        id: id,
      },
    },
  });
  chats = await getDataValuesFromObject({ objects: chats });
  for (let chat of chats) {
    socket.join(chat.id);
    // console.log(socket.id, " aggiunto alla chat ", chat.chatName);
  }
};

const getAllUsers = async ({ who }) => {
  let users = undefined;
  let ret = [];
  switch (who) {
    case "all":
      users = await User.findAll();
      break;
    case "only-connected":
      users = await User.findAll({ where: { online: 1 } });
      break;
    case "only-disconnected":
      users = await User.findAll({ where: { online: 0 } });
      break;
    default:
      break;
  }
  // estrapolare solo i dataValues degli utenti
  ret = await getDataValuesFromObject({ objects: users });
  return ret;
};

const getChatsByUserId = async ({ id }) => {
  let chats = await Chat.findAll({
    include: [
      {
        model: Message,
        include: [
          {
            model: User,
          },
        ],
      },
      { model: User, through: { model: UserChat }, where: { id: id } },
    ],
    order: [["updatedAt", "ASC"]],
  });
  chats.length !== 0 &&
    (chats = await getDataValuesFromObject({ objects: chats }));
  return chats;
};

const getChatId = async ({ roomName }) => {
  return await Chat.findOne({ where: { chatName: roomName } });
};

const sendMessage = async ({ data, id }) => {
  let ret = "ko";
  try {
    await Message.create({
      text: data.message,
      UserId: id,
      ChatId: data.idChat,
    });
    ret = "ok";
  } catch (error) {
    throw new Error(logger.error("Error creating a new message: ", error));
  }
  return ret;
};

const getMessage = async (idMessage) => {
  let message = await Message.findOne({
    where: { id: idMessage },
    include: [
      {
        model: User,
      },
    ],
  });
  return message.dataValues;
};

const getSocketsIdOfUsers = async ({ members }) => {
  let sockets = [];
  let users = await User.findAll({
    where: { id: members, socket: { [Op.not]: "" } },
  });
  users = await getDataValuesFromObject({ objects: users });
  users.forEach((user) => {
    sockets.push(user.socket);
  });
  return sockets;
};

const changeUsername = async ({ user }) => {
  let userFound = await User.findByPk(user.id);
  userFound.userName = user.name;
  await userFound.save();
};

const createChat = async ({ id, data }) => {
  data.groupSelected.push(id);
  let newChat = await Chat.create({ chatName: data.newGroupName });
  let usersOfTheGroup = await User.findAll({
    where: { id: data.groupSelected },
  });
  let usersChatsMap = usersOfTheGroup.map((user) => {
    return { UserId: user.id, ChatId: newChat.dataValues.id };
  });
  let ret = await UserChat.bulkCreate(usersChatsMap);
  return ret;
};

const getUserName = async ({ id }) => {
  let user = await User.findByPk(id);
  return user;
};

const getDataValuesFromObject = async ({ objects }) => {
  let ret = [];
  for (let object of objects) {
    ret.push(object.dataValues);
  }
  return ret;
};

const disconnectUser = async ({ userId }) => {
  let user = await User.findByPk(userId);
  if (user) {
    user.online = 0;
    user.socket = "";
    await user.save();
  }
};

const utilsDB = {
  sequelize,
  User,
  Chat,
  Message,
  synchronizeDB,
  setAllUsersDisconnected,
  connectUser,
  joinUserToRooms,
  changeUsername,
  createChat,
  disconnectUser,
  getChatsByUserId,
  sendMessage,
  getMessage,
  getSocketsIdOfUsers,
};

export { utilsDB };
