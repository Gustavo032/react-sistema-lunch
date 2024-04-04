import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { MealOptionCard } from "./MealOptionCard";

export function RequestScreen(){
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
						MapleBear Granja Vianna
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
                templateRows="repeat(2, 1fr)"
                templateColumns="repeat(2, 1fr)"
                gap={6}
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
								w="60rem" // Largura total dos 2 quadrados + 6px de gap
								zIndex={2}
								padding="5rem"
								>
                <MealOptionCard text="Café da Manhã" backgroundImage={"/img/coffeeImage.png"} option={"option1"}/>
                <MealOptionCard text="Almoço" backgroundImage={"/img/lunchImage.png"} option={"option2"}/>
                <MealOptionCard text="Café da Tarde" backgroundImage={"/img/coffeeImage.png"} option={"option3"}/>
                <MealOptionCard text="Cantina/Outros" backgroundImage={"/img/othersImage.png"} option={"option4"}/>
            </Grid>
        </Box>
    );
}
