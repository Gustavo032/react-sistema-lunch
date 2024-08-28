import React, { useRef, useState } from "react";
import { Box, Center, Text, UnorderedList, ListItem, Button, Flex, useColorModeValue, useBreakpointValue, Spinner } from "@chakra-ui/react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

interface TicketScreenProps {
  ticketData: any;
}

export function TicketScreen(props: TicketScreenProps) {
  const { ticketData } = props;
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/printTicket`, ticketData);
      console.log("Ticket enviado para impressão com sucesso!");

      setTimeout(() => {
        navigate("/?endRequest=true");
      }, 1000);
    } catch (error) {
      console.error("Erro ao enviar o ticket para impressão:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentUrl = window.location.href;
  const isSameUrl = (
    currentUrl === 'https://maplebear.ineedti.com/' ||
    currentUrl === 'https://maplebear.ineedti.com/ticket' ||
    currentUrl === 'http://maplebear.ineedti.com' ||
    currentUrl === 'http://maplebear.ineedti.com/ticket'
  );

  const buttonComponent = useBreakpointValue({
    base: (
      <Button mt={6} colorScheme="blue" onClick={() => navigate('/')} isDisabled={isLoading}>
        Encerrar e Sair
      </Button>
    ),
    md: (
      <Button
        mt={6}
        colorScheme="blue"
        onClick={handlePrint}
        isLoading={isLoading}
        isDisabled={isLoading}
      >
        {isLoading ? <Spinner size="sm" /> : "Imprima Seu Ticket"}
      </Button>
    ),
  });

  return (
    <Center h="100vh" bgSize="cover" bgPosition="center" backgroundImage="./img/mapleBearBackground.jpg">
      <Text
        position="absolute"
        top="4"
        left="4"
        color="white"
        fontSize="2xl"
        zIndex="2"
      >
        MapleBear Granja Viana
      </Text>
      <Flex
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="rgba(0, 0, 0, 0.5)"
        zIndex="1"
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
        ref={contentRef}
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
                {item.title} - Quantidade: {item.quantity} - Preço: {Number(item.price).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
              </ListItem>
            )
          ))}
        </UnorderedList>
        <Text mt={4} fontWeight="bold" textAlign="left">Total: {Number(ticketData.total).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</Text>
        {isSameUrl ? (
					<Button mt={6} colorScheme="blue" onClick={() => navigate('/')} isDisabled={isLoading}>
						Encerrar e Sair
					</Button>
				) : buttonComponent}
      </Box>
    </Center>
  );
}

export default TicketScreen;
