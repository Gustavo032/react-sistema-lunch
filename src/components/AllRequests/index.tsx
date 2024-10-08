import React, { useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Flex, Image, Button, Select, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import { endOfDay, format, startOfDay } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon, DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';

interface RequestItem {
  itemId: string;
  itemTitle: string;
}

interface Request {
  id: string;
  sequence: number;
  user_name: string;
  userImage: string;
  requestItems: RequestItem[];
  items: RequestItem[];
  status: string;
  created_at: string;
}

const AllRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate] = useState<Date>(startOfDay(new Date()));
  const [endDate] = useState<Date>(endOfDay(new Date()));
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();

  const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift();
    }
  };

  const setCookie = (name: string, value: string, expires: Date) => {
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
  };

  const setStatusCookie = (id: string, status: string) => {
    const endOfDayDate = endOfDay(new Date());
    setCookie(`status_${id}`, status, endOfDayDate);
  };

  const getStatusCookie = (id: string): string => {
    return getCookie(`status_${id}`) || 'Em Aberto';
  };

  const handleStatusChange = (id: string, status: string) => {
		const updateRequests = (requestsList: Request[]) =>
			requestsList.map((request) =>
				request.id === id ? { ...request, status } : request
			);
	
		setRequests((prevRequests) => {
			const updatedRequests = updateRequests(prevRequests);
			console.log('Pedidos atualizados após mudança de status:', updatedRequests); // Verifique os pedidos atualizados
			setFilteredRequests(updatedRequests.filter((request) =>
				request.user_name.toLowerCase().includes(searchTerm)
			));
			return updatedRequests;
		});
	
		setStatusCookie(id, status);
	};
	
	

  const handleDeleteRequest = async (id: string) => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    
    if (window.confirm('Tem certeza de que deseja excluir este pedido?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/requests/${id}/delete`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
        setFilteredRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
      } catch (error) {
        console.error('Error deleting request:', error);
      }
    }
  };

  useEffect(() => {
    const userRole = getCookie('userRole');
    if (userRole !== 'ADMIN' && userRole !== 'MIDDLE') {
      navigate('/');
    }
  }, [navigate]);

	useEffect(() => {
		const urlBase = process.env.REACT_APP_API_BASE_URL ?? 'https://api-m.ineedti.com';
		const wsProtocol = urlBase.startsWith('https:') ? 'wss:' : 'ws:';
		const socketUrl = `${wsProtocol}//${urlBase.split('//')[1]}/requests/updates`;
	
		let socket: WebSocket;
	
		const connect = () => {
			socket = new WebSocket(socketUrl);
	
			socket.onopen = () => {
				console.log('Conectado ao servidor WebSocket');
			};
	
			socket.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);
	
					if (data && (data.event === 'initialRequests' || data.event === 'newRequest')) {
						const formatRequestItems = (requestItems: any[]) => {
							return requestItems.map((item) => ({
								itemId: item.id,
								itemTitle: item.title
							}));
						};
	
						if (data.event === 'initialRequests') {
							const formattedRequests = data.requests.map((request: any) => ({
								...request,
								requestItems: formatRequestItems(request.items), // Assumindo que `items` deve ser formatado como `requestItems`
								status: getStatusCookie(request.id),
								created_at: format(new Date(request.created_at), 'dd/MM/yyyy HH:mm:ss')
							}));
							setRequests(formattedRequests);
							setFilteredRequests(formattedRequests);
						} else if (data.event === 'newRequest') {
							const newRequest = {
								...data.request,
								requestItems: formatRequestItems(data.request.requestItems), // Formatar `requestItems` para `newRequest`
								status: getStatusCookie(data.request.id),
								created_at: format(new Date(data.request.created_at), 'dd/MM/yyyy HH:mm:ss')
							};
	
							setRequests((prevRequests) => {
								const newRequests = prevRequests.filter(
									(request) => request.id !== newRequest.id
								);
								return [newRequest, ...newRequests];
							});
	
							setFilteredRequests((prevRequests) => {
								const newRequests = prevRequests.filter(
									(request) => request.id !== newRequest.id
								);
								return [newRequest, ...newRequests];
							});
						}
					} else {
						console.error('Unknown event type or data format:', data);
					}
				} catch (error) {
					console.error('Error parsing WebSocket message:', error);
				}
			};
	
			socket.onerror = (error) => {
				console.error('WebSocket error:', error);
				socket.close();
			};
		};
	
		connect();
	
		return () => {
			if (socket) {
				socket.close();
			}
		};
	}, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em Aberto':
        return 'yellow.200';
      case 'Pedido Feito':
        return 'green.200';
      case 'Em Preparo':
        return 'blue.200';
      default:
        return 'gray.100';
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const searchTerm = event.target.value.toLowerCase();
		setSearchTerm(searchTerm);
	
		const filtered = requests.filter((request) =>
			request.user_name.toLowerCase().includes(searchTerm)
		);
		console.log('Pedidos filtrados após mudança de busca:', filtered); // Verifique os pedidos filtrados
		setFilteredRequests(filtered);
	};
	

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    onOpen();
  };

  return (
    <Box p="4" bgColor="gray.900" minH="100vh">
      <>
        <Flex mb="4" alignItems="center" justifyContent={"space-between"}>
          <Flex w="30%">
            <Button
              colorScheme="whiteAlpha"
              onClick={() => navigate('/admin')}
              zIndex="2"
              h="3rem"
              mr="1rem"
              _hover={{ bg: 'whiteAlpha.800' }}
              _active={{ bg: 'whiteAlpha.600' }}
            >
              <ArrowBackIcon color="white" boxSize={6} />
            </Button>
            <Flex justify="center" bgColor="gray.100" w="100%" border="solid gray 0.05rem" p="0.06rem 0" borderRadius="9999999px">
              <Image src="/Logo_Maple_Bear.png" h="3rem" />
            </Flex>
          </Flex>
        </Flex>

        <Box p="4" bg="gray.100" borderRadius="md" border="solid gray 0.16rem">
          <Input
            placeholder="Pesquisar por nome"
            value={searchTerm}
            onChange={handleSearchChange}
            mb="4"
          />
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nº</Th>
                <Th>Usuário</Th>
                <Th>Itens</Th>
                <Th>Status</Th>
                <Th>Data de Criação</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
						{filteredRequests && filteredRequests.map((request) => (
  							<Tr key={request.id} bgColor={getStatusColor(request.status)}>
                  <Td>{request.sequence}</Td>
                  <Td>
                    <Flex align="center">
                      <Image 
                        w="3rem" 
                        h="3rem" 
                        src={request.userImage} 
                        cursor="pointer" 
                        onClick={() => handleImageClick(request.userImage)} 
                      />
                      {request.user_name}
                    </Flex>
                  </Td>
                  <Td>
                    <ul>
                      {request.requestItems && request.requestItems.map((item, index) => (
                        <li key={`${request.id}-${item.itemId}-${index}`}>{item.itemTitle}</li>
                      ))}
                    </ul>
                  </Td>
                  <Td>
                    <Select
                      value={request.status}
                      onChange={(e) => handleStatusChange(request.id, e.target.value)}
                    >
                      <option value="Em Aberto">Em Aberto</option>
                      <option value="Pedido Feito">Pedido Feito</option>
                      <option value="Em Preparo">Em Preparo</option>
                    </Select>
                  </Td>
                  <Td>{request.created_at}</Td>
                  <Td>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDeleteRequest(request.id)}
                      leftIcon={<DeleteIcon />}
                    >
                      Excluir
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {selectedImage && (
          <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Imagem do Usuário</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Image src={selectedImage} w="100%" />
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </>
    </Box>
  );
};

export default AllRequests;
