import React from 'react';
import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';

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

export function ItemList({ items, onDelete }:ItemListProps){
  return (
    <Stack spacing={4}>
      {items.map((item) => (
        <Box key={item.id} p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Text>{item.title}</Text>
          <Text>Price: ${item.price}</Text>
          <Button leftIcon={<FiTrash2 />} colorScheme="red" onClick={() => onDelete(item.id)}>
            Delete
          </Button>
        </Box>
      ))}
    </Stack>
  );
};
