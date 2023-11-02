import { PropTypes } from "prop-types";

function Messagges({ messaggi }) {
  return (
    <>
      {messaggi.map((messaggio, chiave) => {
        return (
          <p key={chiave}>
            {messaggio.utente}: {messaggio.testo}
          </p>
        );
      })}
    </>
    // <p>No</p>
  );
}

Messagges.propTypes = {
  messaggi: PropTypes.array,
};

export default Messagges;
