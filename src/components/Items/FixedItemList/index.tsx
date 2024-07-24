import React from "react";
import { Box, Button, Text, SimpleGrid } from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";

interface Item {
  id: string;
  created_at: string;
  title: string;
  price: number;
  deleted: boolean;
}

interface FixedItemListProps {
  items: Item[];
  onEdit: (item: Item) => void;
}

const fixedItems = ["Almoço", "Café da Manhã", "Café da Tarde"];

const FixedItemList: React.FC<FixedItemListProps> = ({ items, onEdit }) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
      {items
        .filter((item) => fixedItems.includes(item.title))
        .map((item) => (
          <Box key={item.id} p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="teal.100">
            <Text fontWeight="bold" mb={2}>{item.title}</Text>
            <Text>Preço: {Number(item.price).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</Text>
            <Button leftIcon={<FiEdit />} colorScheme="blue" mt={4} onClick={() => onEdit(item)}>
              Editar
            </Button>
          </Box>
        ))}
    </SimpleGrid>
  );
};

export default FixedItemList;
