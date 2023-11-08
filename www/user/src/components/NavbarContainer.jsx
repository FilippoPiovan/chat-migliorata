import {
  Input,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Avatar,
  Chip,
} from "@nextui-org/react";
import useSocketEvents from "../hooks/useSocket.js";
import { useUser } from "../stores/storeUser.js";
function NavbarContainer() {
  const { socket, isSocketConnected } = useSocketEvents();
  const { id, name, setName } = useUser();

  const onNameChange = () => {
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
      <Navbar>
        <NavbarBrand className="sm:flex gap-4">
          <Avatar
            showFallback
            isBordered
            radius="md"
            color="primary"
            className="w-12 h-10 text-large"
          />
          <Input
            type="text"
            onChange={(e) => {
              setName(e.target.value);
            }}
            onBlur={() => onNameChange()}
            label="Username:"
            placeholder={" "}
            value={name}
          />
        </NavbarBrand>
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
