import { Box, Button, ButtonGroup, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export function RequestItem(props:any){
	return(
		<Box
				rounded={'lg'}
				bg={useColorModeValue('white', 'gray.700')}
				boxShadow={'lg'}
				p={8}
			>
				<Stack spacing={4}>
					<Text color="black" fontWeight="bold" fontSize="xl">Item selecionado: {props.itemTitle}</Text>
					<Box marginTop="1rem" maxW="426px" w="100%" bgImage={`${props.bgImage}`}
							h="20rem" bgSize="cover" bgPos="center" borderRadius="lg" mb="4" position="relative">
					</Box>
					<Text color="black" fontWeight="bold" fontSize="xl">Total: R$ {props.price}</Text>

					<ButtonGroup flex={"row"} alignItems={"center"} justifyContent="space-between" w="100%" alignSelf={"center"}>
						<Button as={Link} to="/dashboard" colorScheme="blue" w="40%" variant="outline">Voltar</Button>
						<Button colorScheme="red" w="40%">Continuar</Button>
					</ButtonGroup>
				</Stack>
			</Box>		
	)
}