import { Box, Flex, Grid, Text, useToast, useBreakpointValue } from "@chakra-ui/react";
import { MealOptionCard } from "./MealOptionCard";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export function RequestScreen() {
  const [countdown, setCountdown] = useState(8); // Estado para o contador
  const navigate = useNavigate(); // Hook para navegação
  const toast = useToast(); // Hook para exibir notificações
  const isSmallScreen = useBreakpointValue({ base: true, md: false }, { fallback: String(true) });
  const firstRender = useRef(true); // Ref para controlar o primeiro render

  useEffect(() => {
    if (isSmallScreen) {
      return; // Não inicia o contador em telas pequenas
    }

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000); // Atualiza a cada segundo

    return () => clearInterval(timer); // Limpa o timer se o componente for desmontado
  }, [isSmallScreen]);

  useEffect(() => {
    if (isSmallScreen) {
      return; // Não exibe o toast em telas pequenas
    }

    if (countdown === 0) {
      navigate('/');
    }

    if (countdown > 0) {
      const toastId = `countdown-toast-${countdown}`;
      if (!toast.isActive(toastId)) {
        toast({
          id: toastId,
          title: firstRender.current ? "Escolha seu Pedido!" : `Retornando em ${countdown} segundos...`,
          status: "info",
          duration: 1000, // Duração do toast em milissegundos
          isClosable: true,
        });
        firstRender.current = false; // Set firstRender to false after first toast
      }
    }
  }, [countdown, toast, navigate, isSmallScreen]);

  return (
    <Box
      bg="url('./img/mapleBearBackground.jpg')"
      bgSize="cover"
      bgPos="center"
      h="100vh"
      position="relative"
      overflow="hidden" // Impede que o conteúdo vaze
    >
      <Text
        position="absolute"
        top="4"
        left="4"
        color="white"
        fontSize="2xl"
        zIndex="2" // Ajusta a camada de empilhamento para que o texto esteja sobre o overlay
      >
        MapleBear Granja Viana
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

      <Grid
        h="100%"
        templateRows={{ base: "repeat(4, 1fr)", md: "repeat(2, 1fr)" }} // 4 linhas em telas pequenas, 2 linhas em telas médias e maiores
        templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} // 1 coluna em telas pequenas, 2 colunas em telas médias e maiores
        gap={6}
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        w={{ base: "90%", md: "60rem" }} // Largura total ajustada para 90% da tela em telas pequenas, 60rem em telas médias e maiores
        zIndex={2}
        padding="5rem"
      >
        <MealOptionCard text="Lanche da Manhã" backgroundImage={"/img/coffeeImage2.png"} option={"option1"} />
        <MealOptionCard text="Almoço" backgroundImage={"/img/lunchImage.png"} option={"option2"} />
        <MealOptionCard text="Lanche da Tarde" backgroundImage={"/img/coffeeImage.png"} option={"option3"} />
        <MealOptionCard text="Cantina/Outros" backgroundImage={"/img/othersImage.png"} option={"option4"} />
      </Grid>
    </Box>
  );
}
