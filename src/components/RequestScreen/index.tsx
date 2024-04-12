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
                <MealOptionCard text="Lanche da Manhã" backgroundImage={"/img/coffeeImage2.png"} option={"option1"}/>
                <MealOptionCard text="Almoço" backgroundImage={"/img/lunchImage.png"} option={"option2"}/>
                <MealOptionCard text="Lanche da Tarde" backgroundImage={"/img/coffeeImage.png"} option={"option3"}/>
                <MealOptionCard text="Cantina/Outros" backgroundImage={"/img/othersImage.png"} option={"option4"}/>
            </Grid>
        </Box>
    );
}
