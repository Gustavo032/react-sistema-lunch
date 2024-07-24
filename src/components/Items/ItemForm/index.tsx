import React, { useState } from "react";
import { Box, Button, Input, Stack, FormControl, FormLabel } from "@chakra-ui/react";

interface ItemFormProps {
  onAdd: (title: string, price: number) => void;
  initialTitle?: string;
  initialPrice?: number;
}

const ItemForm: React.FC<ItemFormProps> = ({
  onAdd,
  initialTitle = "",
  initialPrice = 0,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [price, setPrice] = useState(initialPrice.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(title, parseFloat(price));
    setTitle("");
    setPrice("");
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Título</FormLabel>
            <Input
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isReadOnly={!!initialTitle}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Preço</FormLabel>
            <Input
              placeholder="Preço"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </FormControl>
          <Button type="submit" colorScheme="blue">
            {initialTitle ? "Atualizar Item" : "Adicionar Item"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default ItemForm;
