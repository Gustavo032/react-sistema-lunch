import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import ItemList from './ItemList';
import ItemForm from './ItemForm';

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
  const toast = useToast();
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
    '$1'
  );

  const fetchItems = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/items/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setItems(response.data.items.item);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/items/${id}/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchItems();
  };

  const handleAdd = async (title: string, price: number) => {
    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/items/create`, { title, price }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchItems();
    toast({
      title: 'Item adicionado.',
      description: 'O item foi adicionado com sucesso.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bgSize="cover"
      bgPosition="center"
      position="relative"
    >
      <Flex
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="rgba(0, 0, 0, 0.5)"
        zIndex="1"
      ></Flex>

      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}
        bg="rgba(255, 255, 255, 0.8)"
        zIndex="2"
        position="relative"
        border="#fff solid 0.12rem"
        align="center"
      >
        <Heading color="gray.800" lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Lista de Itens
        </Heading>
        <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={onOpen}>
          Adicionar Item
        </Button>
        <ItemList items={items} onDelete={handleDelete} />
      </Stack>

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
          <ModalBody>
            <ItemForm onAdd={handleAdd} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default ListItens;
