import { PropTypes } from "prop-types";

function Messagges({ messages }) {
  let last = messages.length;
  return (
    <>
      {last !== 0 ? (
        <div className="w-[100%] max-h-[48px] overflow-hidden">
          <p>
            {messages[last - 1].User.userName}: {messages[last - 1].text}
          </p>
        </div>
      ) : (
        <div className="w-[100%] max-h-[48px] overflow-hidden">
          Rompi tu il ghiaccio
        </div>
      )}
    </>
  );
}

Messagges.propTypes = {
  messages: PropTypes.array,
};

export default Messagges;
