import React, { useEffect, useState } from 'react';
import { Button, Flex, Text, Stack, SimpleGrid, Link } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<any>('');

  useEffect(() => {
    const getCookie = (name: string): string | undefined => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(';').shift();
      }
    };

    const role = getCookie('userRole');
    setUserRole(role);
    if (role !== 'ADMIN' && role !== 'MIDDLE' && role !== 'PROF') {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/');
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      backgroundImage="./img/mapleBearBackground.jpg"
      bgSize="cover"
      bgPosition="center"
      position="relative"
    >
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

      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}
        bg="rgba(255, 255, 255, 0.8)"
        zIndex="2"
        position="relative"
        border="#fff solid 0.12rem"
        align="center"
      >
        <Text color="gray.800" lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Bem-vindo ao Painel de Administração<Link
            position="absolute"
            color="#000000"
            top="2rem"
            right="2rem"
            fontSize="lg"
            zIndex="2"
            onClick={handleLogout}
            textDecor={"underline"}
            _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            Sair
          </Link>
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
          {(userRole === 'ADMIN' || userRole === 'MIDDLE') && (
            <>
              <Button
								p="2rem"
								border="white solid 0.12rem"
								m="0.5rem 0 0.5rem 0"
                color={'white'}
                bgColor={'red.500'}
                _hover={{
                  bgColor: 'red',
                  opacity: 0.5,
                }}
                _active={{
                  bgColor: 'red.300',
                }}
                variant={'solid'}
                onClick={() => navigate('/allRequests')}
              >
                Pedidos em Tempo Real
              </Button>
							<Button
								p="2rem"
								border="white solid 0.12rem"
								m="0.5rem 0 0.5rem 0"
                color={'white'}
                bgColor={'red.500'}
                _hover={{
                  bgColor: 'red',
                  opacity: 0.5,
                }}
                _active={{
                  bgColor: 'red.300',
                }}
                variant={'solid'}
                onClick={() => navigate('/createItem')}
              >
                Cadastrar Item
              </Button>
            </>
          )}
					<Button
						p="2rem"
						border="white solid 0.12rem"
						m="0.5rem 0 0.5rem 0"
						color={'white'}
						bgColor={'red.500'}
						_hover={{
							bgColor: 'red',
							opacity: 0.5,
						}}
						_active={{
							bgColor: 'red.300',
						}}
						variant={'solid'}
						onClick={() => navigate('/dashboard')}
					>
						Solicitar uma Refeição
					</Button>
					{(userRole === 'ADMIN' || userRole === 'PROF' || userRole === "MIDDLE") && (
						<>
              <Button
								p="2rem"
								border="white solid 0.12rem"
								m="0.5rem 0 0.5rem 0"
                color={'white'}
                bgColor={'red.500'}
                _hover={{
                  bgColor: 'red',
                  opacity: 0.5,
                }}
                _active={{
                  bgColor: 'red.300',
                }}
                variant={'solid'}
                onClick={() => navigate('/createUser')}
              >
                Criar Usuário
              </Button>
							<Button
								p="2rem"
								border="white solid 0.12rem"
								m="0.5rem 0 0.5rem 0"
                color={'white'}
                bgColor={'red.500'}
                _hover={{
                  bgColor: 'red',
                  opacity: 0.5,
                }}
                _active={{
                  bgColor: 'red.300',
                }}
                variant={'solid'}
                onClick={() => navigate('/dashTokens')}
              >
                Gerenciar Tokens
              </Button>
						</>
					)}
          {userRole === 'ADMIN' && (
            <>
              <Button
								p="2rem"
								border="white solid 0.12rem"
								m="0.5rem 0 0.5rem 0"
                color={'white'}
                bgColor={'red.500'}
                _hover={{
                  bgColor: 'red',
                  opacity: 0.5,
                }}
                _active={{
                  bgColor: 'red.300',
                }}
                variant={'solid'}
                onClick={() => navigate('/controle')}
              >
                Controle Geral
              </Button>
            </>
          )}
        </SimpleGrid>
      </Stack>
    </Flex>
  );
}
