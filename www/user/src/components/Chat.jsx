import PropTypes from "prop-types";
import { useChats } from "../stores/storeChats.js";
import { useUser } from "../stores/storeUser.js";
import { Input, Button } from "@nextui-org/react";
import { useState } from "react";

const Chat = ({ idChat }) => {
  const { id } = useUser();
  const { chats } = useChats();
  const [value, setValue] = useState("");
  let index = undefined;
  if (chats) {
    index = chats.findIndex((chat) => {
      return chat.id === idChat;
    });
  }

  console.log(chats[index]);
  return (
    <>
      <div className="p-2">
        {idChat !== null ? (
          <h1 className="text-lg font-semibold">
            Chat {chats[index].chatName}
          </h1>
        ) : (
          <h1 className="text-lg font-semibold">
            Seleziona una chat per leggere i messaggi
          </h1>
        )}
      </div>
      <div className="bg-blue-600 mx-3 mb-3 flex-grow overflow-auto">
        {idChat !== null ? (
          <>
            {chats[index].Messages.map((value, key) => {
              console.log("value: ", value.UserId === id);
              console.log("key: ", key);
              return value.UserId === id ? (
                <div key={key} className="flex justify-end m-1">
                  <p className="bg-slate-400 max-w-[600px] px-1 rounded-small">
                    {value.User.userName}: {value.text}
                  </p>
                </div>
              ) : (
                <div key={key} className="flex justify-start m-1">
                  <p className="bg-slate-300 max-w-[600px] px-1 rounded-small">
                    {value.User.userName}: {value.text}
                  </p>
                </div>
              );
            })}
          </>
        ) : (
          <div className="flex justify-center items-center h-40">
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
            />
            <span className="material-symbols-outlined">forum</span>
          </div>
        )}
      </div>
      <div className="flex flex-row items-center justify-between px-3 pb-3">
        <div className="w-11/12">
          <Input
            placeholder="Scrivi un messaggio"
            value={value}
            onValueChange={setValue}
            color="primary"
          />
        </div>
        <Button isIconOnly color="primary" className="w-14 h-14">
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          />
          <span className="material-symbols-outlined">send</span>
        </Button>
      </div>
    </>
  );
};

Chat.propTypes = {
  idChat: PropTypes.number,
};

export default Chat;
