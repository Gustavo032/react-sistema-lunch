import { Box, GridItem,  Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export function MealOptionCard(props: any){
	return (
		<GridItem as={Link} 
			to={`/mealOptionPage/${props.option}`} 
			bg="rgba(0,0,0,0.6)" 
			borderRadius="lg" 
			position="relative"
		>
			<Box
					backgroundImage={`${props.backgroundImage}`}
					bgSize="cover"
					bgPos="center"
					borderRadius="0.55rem"
					h="100%" // Altura de cada quadrado
					position="relative"
			>
					<Text
							userSelect={"none"}
							textAlign="center"
							fontSize="xl"
							fontWeight="bold"
							color="white"
							position="absolute"
							top="50%"
							left="50%"
							transform="translate(-50%, -50%)"
					>
							{props.text}
					</Text>
			</Box>
	</GridItem>
	)
}