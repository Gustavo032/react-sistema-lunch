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
    <Center h="100vh">
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
				bgColor={useColorModeValue('white', 'gray.700')}
      >
        <Text fontSize="xl">Detalhes do Pedido</Text>
        <Text mt={4}>Horário e data de criação: {new Date().toLocaleString()}</Text>
        <Text>ID da solicitação: {ticketData.requestId}</Text>
        <Text mt={4}>Itens comprados:</Text>
        <UnorderedList>
          {ticketData.items.map((item: any, index: number) => (
            item.quantity > 0 && (
              <ListItem key={index}>
                {item.title} - Quantidade: {item.quantity} - Preço: R$ {item.price}
              </ListItem>
            )
          ))}
        </UnorderedList>
        <Text mt={4}>Total: R$ {ticketData.total}</Text>
        <Button mt={4} colorScheme="blue" onClick={handlePrint}>Confirmar Pedido</Button>
      </Box>
    </Center>
  );
}

export default TicketScreen;