import React from "react";
import { Box, Center, Text, UnorderedList, ListItem, Button, Flex, useColorModeValue } from "@chakra-ui/react";

interface TicketScreenProps {
  ticketData: any;
}

export function TicketScreen(props: TicketScreenProps) {
  const { ticketData } = props;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Center h="100vh" bgSize="cover" bgPosition="center" backgroundImage="./img/mapleBearBackground.jpg">
				<Text
					position="absolute"
					top="4"
					left="4"
					color="white"
					fontSize="2xl"
					zIndex="2" // Ajusta a camada de empilhamento para que o texto esteja sobre o overlay
				>
					Maplebear Granja Vianna
				</Text>
      {/* Overlay escuro */}
      <Flex
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="rgba(0, 0, 0, 0.5)" // Define um overlay escuro
        zIndex="1" // Ajusta a camada de empilhamento
      ></Flex>
      <Box
        zIndex={2}
        p={8}
        maxW="400px"
        borderWidth={1}
        borderRadius="md"
        boxShadow="lg"
        textAlign="center"
        bgColor={useColorModeValue("white", "gray.700")}
      >
        <Text fontSize="xl" textAlign="left">Detalhes do Pedido</Text>
        <Text fontSize="sm" textAlign="left" color="gray.500">ID da solicitação: {ticketData.requestId}</Text>
        <Text fontSize="sm" textAlign="left" mt="1rem" fontWeight="500">Usuário: {ticketData.userName}</Text>
        <Text fontSize="xs" textAlign="left" color="gray.500" mt={1}>Horário e data de criação: {new Date().toLocaleString()}</Text>
        <Text mt={4} fontWeight="bold" textAlign="left">Itens comprados:</Text>
        <UnorderedList textAlign="left">
          {ticketData.items.map((item: any, index: number) => (
            item.quantity > 0 && (
              <ListItem key={index}>
                {item.title} - Quantidade: {item.quantity} - Preço: R$ {item.price}
              </ListItem>
            )
          ))}
        </UnorderedList>
        <Text mt={4} fontWeight="bold" textAlign="left">Total: R$ {ticketData.total}</Text>
        <Button mt={6} colorScheme="blue" onClick={handlePrint}>Confirmar Pedido</Button>
      </Box>
    </Center>
  );
}

export default TicketScreen;