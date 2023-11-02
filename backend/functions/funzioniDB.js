import { DataTypes, Sequelize, Op } from "sequelize";
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db/chat.db",
  logging: false,
});

try {
  await sequelize.authenticate();
  console.log("Connessione al DB avvenuta con successo");
} catch (error) {
  throw new Error("Impossibile connettersi al DB: " + error);
}

const User = sequelize.define("User", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  online: {
    type: DataTypes.INTEGER,
    allowNull: false,
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

User.belongsToMany(Chat, { through: Message });
Chat.belongsToMany(User, { through: Message });

async function sincronizzaDB() {
  await sequelize.sync();
  console.log("SINCRONIZZAZZIONE AVVENUTA CON SUCCESSO");
}

async function collegaUtente({ idUtente }) {
  console.log("IdUtente: ", idUtente);
  const [utente, created] = await User.findOrCreate({
    where: { id: idUtente },
    defaults: {
      id: idUtente,
      online: 1,
    },
  });

  if (created) {
    console.log("Utente appena creato");
    return User.dataValues;
  } else {
    console.log("Utente già presente");
    const chats = await Message.findAll({
      where: {
        UserId: idUtente,
      },
      order: [
        ["ChatId", "ASC"],
        ["createdAt", "ASC"],
      ],
    });
    // console.log("Chats: ", chats);
    chats.forEach((chat) => {
      // console.log("Singola chat: ", chat.dataValues);
    });
  }

  // return utente.dataValues;
}

export const funzioniDB = {
  User,
  Chat,
  Message,
  sincronizzaDB,
  collegaUtente,
};
