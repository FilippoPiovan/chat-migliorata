import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  CheckboxGroup,
} from "@nextui-org/react";
import { useUsers } from "../stores/storeUsers.js";
import { useState } from "react";
import { CustomCheckbox } from "./CustomCheckbox";

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [groupSelected, setGroupSelected] = useState([]);
  const { users } = useUsers();

  return (
    <div className="flex flex-col gap-2">
      <Button onPress={onOpen}>Nuova chat</Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Seleziona con chi vuoi chattare
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-row gap-1 w-full">
                  <CheckboxGroup
                    value={groupSelected}
                    onChange={setGroupSelected}
                    classNames={{}}
                  ></CheckboxGroup>
                  {users.map((user) => {
                    return (
                      <CustomCheckbox
                        key={user.id}
                        value={user.id}
                        user={{ name: user.userName, status: user.online }}
                      />
                    );
                  })}
                  <p className="mt-4 ml-1 text-default-500">
                    Selected: {groupSelected.join(", ")}
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
