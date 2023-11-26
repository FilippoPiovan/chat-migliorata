import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  CheckboxGroup,
  Breadcrumbs,
  BreadcrumbItem,
  Divider,
  Input,
} from "@nextui-org/react";
import { useUsers } from "../stores/storeUsers.js";
import { useState } from "react";
import { CustomCheckbox } from "./CustomCheckbox";
import PropTypes from "prop-types";

export default function App({ socket }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [groupSelected, setGroupSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState("Seleziona utenti");
  const [newGroupName, setNewGroupName] = useState("Nuovo gruppo");
  const { users } = useUsers();

  const send = (onClose) => {
    console.log("Chat creata, seh, credeghe");
    // groupSelected ['NomeUno', 'NomeDue', ... , 'NomeN']
    socket.emit("create-chat", { groupSelected, newGroupName }, (ret) => {
      // la chat arriva all'utente una volta che viene creata nel DB grazie a 'afterBulkCreate'
      // alert per avvertire del successo o meno dell'operazione (non funziona benissimo)

      // ret.status === "ok"
      //   ? alert("operazione andata a buon fine")
      //   : alert("chat non creata");
      ret.status === "ok"
        ? console.log("operazione andata a buon fine")
        : console.log("operazione NON andata a buon fine");
    });
    setCurrentPage("Seleziona utenti");
    setGroupSelected([]);
    setNewGroupName("Nuovo gruppo");
    onClose();
  };

  // console.log(groupSelected);
  return (
    <div className="flex flex-row items-center">
      <Button onPress={onOpen}>Nuova chat</Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        size="2xl"
        className="max-h-[550px]"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <Breadcrumbs onAction={(key) => setCurrentPage(key)}>
                  <BreadcrumbItem
                    key="Seleziona utenti"
                    isCurrent={currentPage === "Seleziona utenti"}
                  >
                    Seleziona utenti
                  </BreadcrumbItem>
                  <BreadcrumbItem
                    key="Crea chat"
                    isCurrent={currentPage === "Crea chat"}
                    isDisabled={groupSelected.length === 0 ? true : false}
                  >
                    Crea chat
                  </BreadcrumbItem>
                </Breadcrumbs>
              </ModalHeader>
              <Divider className="mx-4 w-auto" />
              {currentPage === "Seleziona utenti" ? (
                <>
                  <ModalBody>
                    <div className="flex flex-wrap flex-row gap-1 w-full p-1">
                      <CheckboxGroup
                        value={groupSelected}
                        onChange={setGroupSelected}
                        orientation="horizontal"
                      >
                        {users.map((user) => {
                          return (
                            <CustomCheckbox
                              className="flex-grow"
                              key={user.id}
                              value={user.userName}
                              user={{
                                name: user.userName,
                                status: user.online,
                              }}
                            />
                          );
                        })}
                      </CheckboxGroup>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="primary"
                      variant="solid"
                      onPress={() => setCurrentPage("Crea chat")}
                      isDisabled={groupSelected.length === 0 ? true : false}
                    >
                      Avanti
                    </Button>
                  </ModalFooter>
                </>
              ) : (
                <>
                  <ModalBody>
                    <div className="flex flex-row flex-wrap gap-1 w-full p-1">
                      <Input
                        type="text"
                        onChange={(e) => {
                          setNewGroupName(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          e.key === "Enter" && send(onClose);
                        }}
                        label="New group name:"
                        placeholder={" "}
                        value={newGroupName}
                      />
                      <p className="mt-4 ml-1">
                        Users selected: {groupSelected.join(", ")}
                      </p>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="danger"
                      variant="light"
                      onPress={() => setCurrentPage("Seleziona utenti")}
                    >
                      Indietro
                    </Button>
                    <Button
                      color="primary"
                      variant="solid"
                      onPress={() => {
                        send(onClose);
                      }}
                    >
                      Crea chat
                    </Button>
                  </ModalFooter>
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

App.propTypes = {
  socket: PropTypes.object,
  isSocketConnected: PropTypes.bool,
};
