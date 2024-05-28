// import axios from 'axios';
// import { useState } from 'react';
// import { Button, Input, Flex, Box, Text, Center, VStack, ButtonGroup } from '@chakra-ui/react';
// import { QrReader } from 'react-qr-reader';

export function ReadQRCode() {
  // const [qrValue, setQRValue] = useState('');
  // const [showScanner, setShowScanner] = useState(false);
  // const [responseMessage, setResponseMessage] = useState('');
  // const [responseStatus, setResponseStatus] = useState('');

  // const handleScan = (data:any) => {
  //   if (data) {
  //     setQRValue(data);
  //     setShowScanner(false);
  //   }
  // }

  // const openScanner = () => {
  //   setShowScanner(true);
  // }

	// const closeScanner = () => {
  //   setShowScanner(false);
  // }

  // const sendPatchRequest = () => {
  //   const token = document.cookie.replace(
  //     /(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
  //     '$1'
  //   );

  //   axios.patch(
  //     `http://192.168.0.149:3333/check-ins/${qrValue}/validate`,
  //     {},
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       }
  //     },
  //   )
  //   .then(response => {
  //     if (response.status === 204) {
  //       setResponseMessage('Check-in validado com sucesso');
  //       setResponseStatus('success');
  //     } else {
  //       setResponseMessage('Erro ao validar check-in');
  //       setResponseStatus('error');
  //     }
  //   })
  //   .catch(error => {
  //     console.error('Erro ao fazer a requisição:', error);
  //     setResponseMessage('Erro ao validar check-in');
  //     setResponseStatus('error');
  //   });
  // }

  return (
		<></>
    // <Center h="100vh" bgColor="gray.600">
    //   <VStack spacing={2} >
    //     <Box boxShadow="0rem 0rem 5rem" bgColor="gray.900" p="2rem" rounded="md">
		// 			<Box mb="1rem">
		// 				<ButtonGroup display="flex" flexDirection="row" justifyContent="space-between">
		// 						<Button maxW="48%" w="100%" onClick={openScanner} colorScheme="blue">Abrir câmera</Button>
		// 						<Button maxW="48%" w="100%" onClick={closeScanner} colorScheme="red">Fechar câmera</Button>
		// 				</ButtonGroup>
		// 				{showScanner ? (
		// 					<Box width="20rem" height="20rem">
		// 						<QrReader
		// 							scanDelay={300}
		// 							constraints={{echoCancellation: true}}
		// 							onResult={handleScan}
		// 							containerStyle={{ width: '100%', height: '100%' }}
		// 						/>
		// 					</Box>
		// 				) : (
		// 					<Box width="20rem" height="20rem">
		// 						{/* space for close scanner */}
		// 					</Box>
		// 				)}
		// 			</Box>

		// 			<Box mt="1rem" display="flex" flexDirection="row" justifyContent="space-between">
    //       	<Input maxW="100%" w="66%"
		// 					type="text"
		// 					color="white"
		// 					value={qrValue}
		// 					onChange={(e) => setQRValue(e.target.value)}
		// 					placeholder="Valor do QR code"
		// 					maxWidth="20rem"
		// 				/>

		// 				<Button maxW="30%" w="30%" onClick={sendPatchRequest} colorScheme="green">
		// 					Validar
		// 				</Button>
		// 			</Box> 

		// 			{responseMessage && (
		// 				<Text mt={4} fontSize="xl" fontWeight="bold" color={responseStatus === 'success' ? 'green.500' : 'red.500'}>
		// 					{responseMessage}
		// 				</Text>
		// 			)}

    //     </Box>
    //   </VStack>
    // </Center>
  );
}