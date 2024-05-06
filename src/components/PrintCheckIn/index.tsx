// import React, { useState, useEffect } from 'react';
// import { Box, Button, Center, Heading, Text } from '@chakra-ui/react';
// import QRCode from 'react-qr-code';
// import axios from 'axios';

export function PrintCheckIn ()  {
  // const [checkInId, setCheckInId] = useState('');

  // useEffect(() => {
  //   const fetchCheckInId = async () => {
  //     try {
  //       // Obter o token JWT dos cookies
  //       const token = document.cookie.replace(
  //         /(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
  //         '$1'
  //       );

  //       // Se o token JWT estiver presente nos cookies, fazer a requisição para obter o ID de check-in
  //       if (token) {
  //         const response = await axios.post(
  //           'http://localhost:3333/create/check-ins',
  //           {},
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`, // Enviar o token JWT no cabeçalho Authorization
  //             },
  //           }
  //         );
  //         setCheckInId(response.data.checkInId);
  //       } else {
  //         // Se não houver token JWT nos cookies, redirecionar para a página de login
  //         window.location.href = '/login'; // Substitua '/login' pela rota de login da sua aplicação
  //       }
  //     } catch (error) {
  //       console.error('Error fetching check-in ID:', error);
  //     }
  //   };

  //   fetchCheckInId();
  // }, []);

  return (
		<></>
    // <Box backgroundColor="#f0f0f0" minHeight="100vh">
    //   <Center flexDirection="column" padding="2rem" minHeight="100vh">
    //     <Heading marginBottom="1rem" color="black">Check-in QR Code</Heading>
    //     {checkInId && (
    //       <Box
    //         padding="1rem"
    //         border="2px solid #ccc"
    //         borderRadius="8px"
    //         backgroundColor="#fff"
    //         display="flex"
    //         flexDirection="column"
    //         alignItems="center"
    //       >
    //         <Text marginBottom="1rem" color="black">Check-in ID: {checkInId}</Text>
    //         <QRCode value={`${checkInId}`} size={200} />
    //         <Text color="#888" fontSize="14px" marginTop="1rem">Scan this QR Code to validate check-in</Text>
    //       </Box>
    //     )}
		// 		<Button as="a" href='/validateCheckIn'>
		// 				Valide Agora (only admin):
		// 		</Button>
    //   </Center>
    // </Box>
  );
};

