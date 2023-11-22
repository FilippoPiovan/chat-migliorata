import {
  Input,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Avatar,
  Chip,
} from "@nextui-org/react";
import { useUser } from "../stores/storeUser.js";
import ModalContainer from "./ModalContainer.jsx";
import PropTypes from "prop-types";

function NavbarContainer({ socket, isSocketConnected }) {
  const { id, name, setName } = useUser();
  const onNameChanged = () => {
    socket.emit("name-changed", { name, id }, (ret) => {
      if (ret.status === "ko") {
        console.log("aggiornamento del nome non andato a buon fine");
      } else {
        console.log("aggiornamento del nome andato a buon fine");
      }
    });
  };

  return (
    <>
      <Navbar position="static" className=" ">
        <NavbarBrand className="sm:flex gap-4">
          <Avatar
            showFallback
            isBordered
            radius="md"
            color="primary"
            className="w-11 h-11 text-large"
          />
          <Input
            type="text"
            onChange={(e) => {
              setName(e.target.value);
            }}
            onBlur={() => onNameChanged()}
            label="Username:"
            placeholder={" "}
            value={name}
            className="w-3/5 ml-4"
          />
        </NavbarBrand>
        <ModalContainer socket={socket} isSocketConnected={isSocketConnected} />
        <NavbarContent justify="end">
          <NavbarItem>
            <Chip
              color={isSocketConnected === false ? "danger" : "success"}
              variant="dot"
            >
              {isSocketConnected === false ? "Offline" : "Online"}
            </Chip>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </>
  );
}

export default NavbarContainer;

NavbarContainer.propTypes = {
  socket: PropTypes.object,
  isSocketConnected: PropTypes.bool,
};
