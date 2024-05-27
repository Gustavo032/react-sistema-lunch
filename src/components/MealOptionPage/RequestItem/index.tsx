import React, { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, Flex, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

interface MenuItemProps {
  id: string;
  title: string;
  price: number;
}

function MenuItem({ item, quantity, onQuantityChange, isFirst }: any) {
  const handleDecrement = () => {
    if (quantity > 0) {
      onQuantityChange(item.id, quantity - 1);
    }
  };

  const borderTopStyle = isFirst ? {} : { borderTop: "solid black 0.06rem" };

  return (
    <li key={item.id} style={{ marginBottom: "0.3rem", paddingTop: "0.3rem", ...borderTopStyle }}>
      <label style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
        {item.title} - R$ {item.price}
        <Flex>
          <Button onClick={handleDecrement}>-</Button>
          <Text margin="0 0.3rem" fontSize="1.3rem">
            {quantity}
          </Text>
          <Button onClick={() => onQuantityChange(item.id, quantity + 1)}>+</Button>
        </Flex>
      </label>
    </li>
  );
}

interface RequestItemProps {
	price: string;
	bgImage: string;
  itemTitle: string;
  ticketData: any;
  setTicketData: React.Dispatch<React.SetStateAction<any>>;
}


export function RequestItem(props: RequestItemProps) {
  const { itemTitle, ticketData, setTicketData } = props;


  const [menuItems, setMenuItems] = useState<MenuItemProps[]>([]);
  const [quantities, setQuantities] = useState<any>({});
  const [total, setTotal] = useState<number>(0);

	useEffect(() => {
    const initialQuantities: { [key: string]: number } = {};
    menuItems.forEach(item => {
      initialQuantities[item.id] = (item.title === "Café da Tarde" || item.title === "Almoço" || item.title === "Café da Manhã") ? 1 : 0;
    });
    setQuantities(initialQuantities);
  }, [menuItems]);

  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
    '$1'
  );
  const navigate = useNavigate();

	const handleContinue = async () => {
    const itemsIds: string[] = [];
    for (const itemId in quantities) {
      const quantity = quantities[itemId];
      for (let i = 0; i < quantity; i++) {
        itemsIds.push(itemId);
      }
    }
		console.log(itemsIds);
    try {
      const response = await axios.post('http://localhost:3333/create/requests', {
        itemsIds: itemsIds
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Response:", response);

			if (response.status === 201) {
				const ticketData = {
					userName: response.data.userName,
					requestId: response.data.requestId,
					items: menuItems.map(item => ({
						title: item.title,
						quantity: quantities[item.id] || 0,
						price: item.price
					})),
					total: total,
					// Outros dados que deseja passar
				};
				
				setTicketData(ticketData);

				navigate('/ticket');
			}
		
      // Coloque aqui qualquer ação que você queira fazer após o envio dos dados, como redirecionar o usuário ou exibir uma mensagem de sucesso.
    } catch (error) {
      console.error('Error:', error);
      // Coloque aqui qualquer ação que você queira fazer em caso de erro, como exibir uma mensagem de erro para o usuário.
    }
  };


  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        let response;
        if (itemTitle === "Almoço" || itemTitle === "Café da Tarde" || itemTitle === "Café da Manhã") {
          response = await axios.get('http://localhost:3333/items/all', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const filteredItems = response.data.items.item.filter((item: MenuItemProps) => item.title === itemTitle);
          setMenuItems(filteredItems);
        } else {
					response = await axios.get('http://localhost:3333/items/all', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const filteredItems = response.data.items.item.filter((item: MenuItemProps) => 
            item.title !== "Almoço" && item.title !== "Café da Tarde" && item.title !== "Café da Manhã"
          );
          setMenuItems(filteredItems);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchMenuItems();
  }, [itemTitle, token]);

	useEffect(() => {
    let calculatedTotal = 0;
    menuItems.forEach((item) => {
      const quantity = quantities[item.id] || 0;
      calculatedTotal += item.price * quantity;
    });
    setTotal(calculatedTotal); // Não formate aqui
  }, [quantities, menuItems]);


  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    const newQuantities = { ...quantities, [itemId]: newQuantity };
    setQuantities(newQuantities);
  };

  return (
    <Box rounded="lg" bg={useColorModeValue('white', 'gray.700')} boxShadow="lg" p={8}>
      <Stack spacing={4}>
        <Text color="black" fontWeight="bold" fontSize="xl">Item selecionado: {itemTitle}</Text>
        {itemTitle === "Cantina" && (
          <ul>           
            {menuItems.map((item, index) => (
              <MenuItem
								isFirst={index===0}
                key={item.id}
                item={item}
                quantity={quantities[item.id] || 0}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </ul>
        )}

				{itemTitle === "Almoço" && (
          <Box marginTop="1rem" maxW="426px" w="100%" bgImage={`${props.bgImage}`}
            h="20rem" bgSize="cover" bgPos="center" borderRadius="lg" mb="4" position="relative">
          </Box>
        )}
				{
					itemTitle === "Café da Tarde" && (
						<Box marginTop="1rem" maxW="426px" w="100%" bgImage={`${props.bgImage}`}
							h="20rem" bgSize="cover" bgPos="center" borderRadius="lg" mb="4" position="relative">
						</Box>
					)
				}
				{
					itemTitle === "Café da Manhã" && (
						<Box marginTop="1rem" maxW="426px" w="100%" bgImage={`${props.bgImage}`}
							h="20rem" bgSize="cover" bgPos="center" borderRadius="lg" mb="4" position="relative">
						</Box>
					)
				}

        <Text color="black" fontWeight="bold" fontSize="xl">Total: R$ { menuItems.length > 0 && menuItems[0].title === itemTitle ? menuItems[0].price : total.toFixed(2)}</Text>
        <ButtonGroup flex={"row"} alignItems={"center"} justifyContent="space-between" w="100%" alignSelf={"center"}>
          <Button as={Link} to="/dashboard" colorScheme="blue" w="40%" variant="outline">Voltar</Button>
					<Button colorScheme="red" w="40%" onClick={handleContinue} disabled={menuItems.length > 2 ? true : false}>Continuar</Button>
        </ButtonGroup>
      </Stack>
    </Box>
  );
}
