import { Box, Heading } from "@chakra-ui/react";
import { ItemList } from "./ItemList";
import axios from "axios";
import { useEffect, useState } from "react";
import { ItemForm } from "./ItemList/ItemForm";

interface Item {
  id: string;
  created_at: string;
  title: string;
  price: number;
  deleted: boolean;
}


export function ListItens(){
	const [items, setItems] = useState<Item[]>([]);
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
    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/items/create`, { title, price },{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
    fetchItems();
  };

  return (
    <Box textAlign="center" py={10}>
      <Heading mb={6}>Item List</Heading>
      <Box bg="gray.100" p={6} borderRadius="md" w="80%" mx="auto">
        <ItemForm onAdd={handleAdd} />
        <ItemList items={items} onDelete={handleDelete} />
      </Box>
    </Box>
  );
}