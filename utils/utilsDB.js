import { DataTypes, Sequelize } from "sequelize";
import { logger } from "./log.js";

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
  name: {
    type: DataTypes.STRING,
    defaultValue: "User",
  },
  online: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

const Chat = sequelize.define("Chat", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
});

const Message = sequelize.define("Message", {
  testo: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "Scrivi per mandare un messaggio",
  },
});

User.afterCreate(async () => {
  logger.info("utente creato");
});

User.afterDestroy(async () => {
  logger.info("utente distrutto");
});

Chat.afterCreate(async () => {
  logger.info("nuova chat creata");
});

Chat.afterDestroy(async () => {
  logger.info("chat distrutta");
});

Message.afterCreate(async () => {
  logger.info("messaggio creato");
});

Message.afterDestroy(async () => {
  logger.info("messaggio eliminato");
});

User.belongsToMany(Chat, { through: Message });
Chat.belongsToMany(User, { through: Message });

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
    logger.info("Utenti resettati");
    ret = true;
  } catch (error) {
    logger.error(error);
  } finally {
    return ret;
  }
};

const connectUser = async ({ userId }) => {
  // logger.info(`${userId} sta provando a connettersi`);
  let chats = undefined;
  let randomName = `User#${Math.round(Math.random() * 999999)}`;
  logger.warn(`RandomName ${randomName}`);
  const [userFromDB, created] = await User.findOrCreate({
    where: { id: userId },
    defaults: {
      id: userId,
      online: 1,
      name: randomName,
    },
  });
  if (!created) {
    userFromDB.online = 1;
    await userFromDB.save();
    chats = await Message.findAll({
      where: {
        UserId: userId,
      },
      order: [
        ["ChatId", "ASC"],
        ["createdAt", "ASC"],
      ],
    });
  }
  return { userFromDB, chats };
};

const changeUsername = async ({ user }) => {
  return await User.update({ name: user.name }, { where: { id: user.id } });
};

const disconnectUser = async ({ userId }) => {
  console.log(userId);
  await User.update({ online: 0 }, { where: { id: userId } });
};

const utilsDB = {
  sequelize,
  User,
  Chat,
  Message,
  synchronizeDB,
  setAllUsersDisconnected,
  connectUser,
  changeUsername,
  disconnectUser,
};

export { utilsDB };
