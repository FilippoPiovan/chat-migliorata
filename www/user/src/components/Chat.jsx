import PropTypes from "prop-types";
import { useChats } from "../stores/storeChats.js";
import { Input, Button } from "@nextui-org/react";
import { useState } from "react";

const Chat = ({ idChat }) => {
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
      <div className="bg-blue-600 mb-3 flex-grow overflow-auto">
        {idChat !== null ? (
          <>
            <div className="contenitoreNomeChat">
              <h1 className="text-lg">Chat {chats[index].chatName}</h1>
            </div>
            {chats[index].Messages.map((value, key) => {
              console.log("value: ", value);
              console.log("key: ", key);
              return (
                <p key={key}>
                  {value.User.userName}: {value.text}
                </p>
              );
            })}
          </>
        ) : (
          <p>Seleziona una chat per vedere i messaggi</p>
        )}
      </div>
      <div className=" flex flex-row items-center justify-between">
        <div className="w-11/12">
          <Input
            placeholder="Scrivi un messaggio"
            value={value}
            onValueChange={setValue}
            color="primary"
          />
        </div>
        <div className="w-auto h-auto items-center">
          <Button isIconOnly color="primary"></Button>
        </div>
      </div>
    </>
  );
};

Chat.propTypes = {
  idChat: PropTypes.number,
};

export default Chat;
