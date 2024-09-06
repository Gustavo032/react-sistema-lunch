import React from "react";
import { Box, Button, Text, SimpleGrid } from "@chakra-ui/react";
import { FiTrash2 } from "react-icons/fi";

interface Item {
  id: string;
  created_at: string;
  title: string;
  price: number;
  deleted: boolean;
}

interface ItemListProps {
  items: Item[];
  onDelete: (id: string) => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, onDelete }) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
      {items
        .filter((item) => !["Almoço", "Almoço Prof", "Café da Manhã", "Café da Tarde"].includes(item.title))
        .map((item) => (
          <Box key={item.id} p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Text fontWeight="bold" mb={2}>{item.title}</Text>
            <Text>Preço: {Number(item.price).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</Text>
            <Button leftIcon={<FiTrash2 />} colorScheme="red" mt={4} onClick={() => onDelete(item.id)}>
              Excluir
            </Button>
          </Box>
        ))}
    </SimpleGrid>
  );
};

export default ItemList;
