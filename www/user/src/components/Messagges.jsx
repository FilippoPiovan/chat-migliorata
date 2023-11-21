import { PropTypes } from "prop-types";

function Messagges({ messaggi }) {
  return (
    <>
      {messaggi.map((messaggio, chiave) => {
        return (
          <p key={chiave}>
            {messaggio.User.userName}: {messaggio.text} {messaggio.createdAt}
          </p>
        );
      })}
    </>
  );
}

Messagges.propTypes = {
  messaggi: PropTypes.array,
};

export default Messagges;
