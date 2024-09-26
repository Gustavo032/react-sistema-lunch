import { Box, Button, ButtonGroup, Center, Flex, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { RequestItem } from './RequestItem';

interface MealOptionPageProps {
  ticketData: any;
  setTicketData: React.Dispatch<React.SetStateAction<any>>;
}

export function MealOptionPage(props: MealOptionPageProps) {
  const { option } = useParams(); // Obtém o parâmetro da URL

  // Função para obter o valor de um cookie pelo nome
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  };

  // Obtém o valor do cookie userRole
  const userRole = getCookie('userRole');

  return (
    <Flex direction="column" alignItems="center" h="100vh" 
      bgSize="cover"
      bgPosition="center"
      backgroundImage="/img/mapleBearBackground.jpg">
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
      {option === 'option1' && (
        <Center zIndex="2" margin={"auto"}>
          <RequestItem price="25,00" bgImage="/img/coffeeImage.png" itemTitle="Café da Manhã" ticketData={props.ticketData} setTicketData={props.setTicketData}/>  
        </Center>
      )}
      {option === 'option2' && (
        <>
          {/* Adiciona a verificação do userRole */}
          {userRole === 'MEMBER' ? (
            <Center zIndex="2" margin={"auto"}>
              <RequestItem price="30,00" bgImage="/img/lunchImage.png" itemTitle="Almoço" ticketData={props.ticketData} setTicketData={props.setTicketData}/>  
						</Center>
          ) : (
            <Center zIndex="2" margin={"auto"}>
              <RequestItem price="30,00" bgImage="/img/lunchImage.png" itemTitle="Almoço Prof" ticketData={props.ticketData} setTicketData={props.setTicketData}/>  
            </Center>
          )}
        </>
      )}
      {option === 'option3' && (
        <Center zIndex="2" margin={"auto"}>
          <RequestItem price="25,00" bgImage="/img/coffeeImage.png" itemTitle="Café da Tarde" ticketData={props.ticketData} setTicketData={props.setTicketData}/>  
        </Center>
      )}
      {option === 'option4' && (
        <Center zIndex="2" margin={"auto"}>
          <RequestItem price="30,00" bgImage="/img/othersImage.png" itemTitle="Cantina" ticketData={props.ticketData} setTicketData={props.setTicketData}/>  
        </Center>
      )}
    </Flex>
  );
}

export default MealOptionPage;
