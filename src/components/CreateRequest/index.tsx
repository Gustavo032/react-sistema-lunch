import { Box, Button, ButtonGroup, Center, Flex, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { RequestItem } from './RequestItem';

export function MealOptionPage() {
  const { option }  = useParams(); // Obtém o parâmetro da URL


  return (
    <Flex direction="column" alignItems="center" h="100vh" backgroundImage="/img/mapleBearBackground.jpg">
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
				<Center 	zIndex="2" margin={"auto"}>
					<RequestItem price="25,00" bgImage="/img/coffeeImage.png" itemTitle="Café da Manhã"/>	
				</Center>
      )}
      {option === 'option2' && (
				<Center zIndex="2" margin={"auto"}>
					<RequestItem price="30,00" bgImage="/img/lunchImage.png" itemTitle="Almoço"/>	
				</Center>
      )}
			 {option === 'option3' && (
				<Center zIndex="2" margin={"auto"}>
					<RequestItem price="25,00" bgImage="/img/coffeeImage.png" itemTitle="Café da Tarde"/>	
				</Center>
      )}
			 {option === 'option4' && (
				<Center zIndex="2" margin={"auto"}>
					<RequestItem price="30,00" bgImage="/img/othersImage.png" itemTitle="Cantina"/>	
				</Center>
      )}
    </Flex>
  );
}

export default MealOptionPage;