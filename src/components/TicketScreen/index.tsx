import React, { useRef } from "react";
import { Box, Center, Text, UnorderedList, ListItem, Button, Flex, useColorModeValue, useBreakpointValue } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';


interface TicketScreenProps {
  ticketData: any;
}

export function createRefToPrint(contentElement: HTMLElement): HTMLElement {
  const clonedContent = contentElement.cloneNode(true) as HTMLElement;

  // Remover elementos indesejados (por exemplo, botões)
  const elementsToRemove = clonedContent.querySelectorAll("button");
  elementsToRemove.forEach(element => element.remove());

  // Definir estilos de impressão
  clonedContent.style.position = "static"; // Impede que o conteúdo flutue na impressão
  clonedContent.style.width = "100%"; // Garante que o conteúdo se ajuste ao papel

  // Adicionar estilos de impressão personalizados
  clonedContent.style.fontFamily = "Arial, sans-serif"; // Define a fonte para a impressão
  clonedContent.style.padding = "20px"; // Adiciona um preenchimento para o conteúdo
  clonedContent.style.backgroundColor = "white"; // Define a cor de fundo para branco

  // Definir tamanho de papel personalizado (por exemplo, 80mm x 200mm para uma impressora térmica)
  clonedContent.style.width = "80mm";
  clonedContent.style.height = "200mm";

  return clonedContent;
}

export function TicketScreen(props: TicketScreenProps) {
  const { ticketData } = props;
  const navigate = useNavigate(); // Obtenha o objeto de histórico
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = () => {
    if (!contentRef.current) return;

    const printableContent = createRefToPrint(contentRef.current);
    const printWindow = window.open();
    if (printWindow) {
      printWindow.document.body.appendChild(printableContent);
      printWindow.print();
      printWindow.close();
    }

    setTimeout(() => {
      navigate("/?endRequest=true");
    }, 1000);
  };

	const ResponsiveButton = () => {
		const navigate = useNavigate();
	
		const buttonComponent = useBreakpointValue({
			base: (
				<Button mt={6} colorScheme="blue" onClick={() => navigate('/')}>
					Encerrar e Sair
				</Button>
			),
			md: (
				<Button mt={6} colorScheme="blue" onClick={handlePrint}>
					Imprima Seu Ticket
				</Button>
			),
		}, {
			fallback: String(
				<Button mt={6} colorScheme="blue" onClick={() => navigate('/')}>
					Encerrar e Sair
				</Button>
			),
		});
	
		return buttonComponent ?? null;
	};
	
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
        <ResponsiveButton/>
      </Box>
    </Center>
  );
}

export default TicketScreen;
