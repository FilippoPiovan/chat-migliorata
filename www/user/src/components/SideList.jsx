import PropTypes from "prop-types";
import Messagges from "./Messagges.jsx";

const SideList = ({ chats, setCurrentChat }) => {
  return (
    <div className="min-h-full w-full max-w-auto overflow-hidden border-medium px-1 py-1 rounded-small border-default-700">
      {chats.map((value, key) => {
        return (
          <div
            key={key}
            className="flex flex-wrap flex-col items-center max-h-[114px] p-2 mb-1 border-small rounded border-default-600 hover:cursor-pointer hover:bg-slate-200"
            onClick={() => {
              console.log("clickato: ", value.id);
              setCurrentChat(value.id);
            }}
          >
            <div className="w-[100%] max-h-[47px] overflow-hidden font-semibold">
              <p>Nome chat: {value.chatName}</p>
            </div>
            <Messagges messages={value.Messages}></Messagges>
          </div>
        );
      })}
    </div>
  );
};

export default SideList;

SideList.propTypes = {
  chats: PropTypes.array,
  setCurrentChat: PropTypes.func,
};
