import React, { useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Flex, Image, Button, Select, Input } from '@chakra-ui/react';
import { endOfDay, format, startOfDay } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';

interface RequestItem {
  id: string;
  title: string;
}

interface Request {
  id: string;
  sequence: number;
  user_name: string;
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
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );
    setStatusCookie(id, status);
  };

  useEffect(() => {
    const userRole = getCookie('userRole');
    if (userRole !== 'ADMIN') {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const urlBase = process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:3333';
    const socketUrl = `${urlBase.replace(/^http/, 'ws')}/requests/updates`;

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
						const updatedRequests: Request[] = data.requests || [data.request];
						const formattedRequests = updatedRequests.map((request) => ({
							...request,
							status: getStatusCookie(request.id),
							created_at: format(new Date(request.created_at), 'dd/MM/yyyy HH:mm:ss')
						}));
				
						if (data.event === 'initialRequests') {
							setRequests(formattedRequests);
							setFilteredRequests(formattedRequests);
						} else if (data.event === 'newRequest') {
							setRequests((prevRequests) => [...formattedRequests, ...prevRequests]);
							setFilteredRequests((prevRequests) => [...formattedRequests, ...prevRequests]);
						}
					} else {
						console.error('Unknown event type or data format:', data);
					}
				} catch (error) {
					console.error('Error parsing WebSocket message:', error);
				}				
				
      };

      // socket.onclose = (event) => {
      //   console.log(`WebSocket closed: ${event.code}, ${event.reason}`);
      //   // Tentativa de reconexão após 3 segundos
      //   setTimeout(connect, 3000);
      // };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        socket.close();
      };
    };

    connect();
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
    setFilteredRequests(filtered);
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
              </Tr>
            </Thead>
            <Tbody>
              {filteredRequests && filteredRequests.map((request, index) => (
                <Tr key={index} bgColor={getStatusColor(request.status)}>
                  <Td>{request.sequence}</Td>
                  <Td>{request.user_name}</Td>
                  <Td>
                    <ul>
                      {request.items && request.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item.title}</li>
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
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </>
    </Box>
  );
};

export default AllRequests;