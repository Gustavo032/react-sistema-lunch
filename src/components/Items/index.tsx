import React, { useState, useEffect } from "react";
import {
  Flex,
  Heading,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import ItemList from "./ItemList";
import FixedItemList from "./FixedItemList";
import ItemForm from "./ItemForm";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

interface Item {
  id: string;
  created_at: string;
  title: string;
  price: number;
  deleted: boolean;
}

const ListItens: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const toast = useToast();
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  const navigate = useNavigate();

  const fetchItems = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/items/all`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setItems(response.data.items.item);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    await axios.delete(
      `${process.env.REACT_APP_API_BASE_URL}/items/${id}/delete`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    fetchItems();
  };

  const handleAdd = async (title: string, price: number) => {
    await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/items/create`,
      { title, price },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    fetchItems();
    toast({
      title: "Item adicionado.",
      description: "O item foi adicionado com sucesso.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    onClose();
  };

  const handleEdit = async (id: string, newTitle: string, newPrice: number) => {
    await axios.delete(
      `${process.env.REACT_APP_API_BASE_URL}/items/${id}/delete`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/items/create`,
      { title: newTitle, price: newPrice },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    fetchItems();
    toast({
      title: "Item atualizado.",
      description: "O item foi atualizado com sucesso.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    setEditingItem(null);
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      backgroundImage="./img/mapleBearBackground.jpg"
      bgSize="cover"
      bgPosition="center"
      position="relative"
    >
      <Text
        position="fixed"
        top="4"
        left="4"
        color="white"
        fontSize="2xl"
        zIndex="2"
      >
        <Button
          colorScheme="whiteAlpha"
          onClick={() => navigate("/admin")}
          zIndex="2"
          mr="1rem"
          _hover={{ bg: "whiteAlpha.800" }}
          _active={{ bg: "whiteAlpha.600" }}
        >
          <ArrowBackIcon color="white" boxSize={6} />
        </Button>
        MapleBear Granja Viana
      </Text>
      <Flex
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="rgba(0, 0, 0, 0.5)"
        zIndex="1"
      ></Flex>

      <Flex
        direction="column"
        align="center"
        maxW="3xl"
        p={4}
        bg="rgba(255, 255, 255, 0.8)"
        rounded="xl"
        border="1px solid #CBD5E0"
        boxShadow="lg"
        zIndex={3}
				mt="5rem"
				mb="5rem"
      >
        <Heading
          as="h1"
          fontSize={{ base: "2xl", md: "3xl" }}
          mb={4}
          color="gray.800"
        >
          Lista de Itens
        </Heading>
        <Button
          leftIcon={<FaPlus />}
          colorScheme="blue"
          onClick={onOpen}
          mb={4}
          size="md"
          fontSize="md"
        >
          Adicionar Item
        </Button>
        <FixedItemList items={items} onEdit={setEditingItem} />
        <hr style={{ width: "100%", margin: "20px 0", borderColor: "gray" }} />
        <ItemList items={items} onDelete={handleDelete} />
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          bg="white"
          color="gray.800"
          borderRadius="xl"
          p={4}
          textAlign="center"
          boxShadow="md"
        >
          <ModalCloseButton color="gray.400" />
          <ModalHeader mt={4} fontSize="xl" fontWeight="bold">
            Adicionar Novo Item
          </ModalHeader>
          <ModalBody >
            <ItemForm onAdd={handleAdd} />
          </ModalBody>
        </ModalContent>
      </Modal>

      {editingItem && (
        <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)} isCentered>
          <ModalOverlay />
          <ModalContent
            bg="white"
            color="gray.800"
            borderRadius="xl"
            p={4}
            textAlign="center"
            boxShadow="md"
          >
            <ModalCloseButton color="gray.400" />
            <ModalHeader mt={4} fontSize="xl" fontWeight="bold">
              Editar Item
            </ModalHeader>
            <ModalBody>
              <ItemForm
                initialTitle={editingItem.title}
                initialPrice={editingItem.price}
                onAdd={(newTitle, newPrice) =>
                  handleEdit(editingItem.id, newTitle, newPrice)
                }
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Flex>
  );
};

export default ListItens;
