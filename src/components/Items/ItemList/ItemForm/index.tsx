import React, { useState } from 'react';
import { Box, Button, Input, Stack } from '@chakra-ui/react';

interface ItemFormProps {
  onAdd: (title: string, price: number) => void;
}

export function ItemForm({ onAdd }:ItemFormProps) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(title, parseFloat(price));
    setTitle('');
    setPrice('');
  };

  return (
    <Box mb={6}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Button type="submit" colorScheme="blue">
            Add Item
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
