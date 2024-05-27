import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Flex, Text, Image, Button, Select } from '@chakra-ui/react';
import { endOfDay, format, startOfDay } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css'; // Import styles
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';

const AllRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [startDate] = useState<Date>(startOfDay(new Date())); // Definindo startDate como o primeiro dia do mês atual
  const [endDate] = useState<Date>(endOfDay(new Date())); // Definindo endDate como o último dia do mês atual

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
    setRequests((prevRequests: any) =>
      prevRequests.map((request: any) =>
        request.id === id ? { ...request, status } : request
      )
    );
    setStatusCookie(id, status);
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const userRole = getCookie('userRole');
    if (userRole !== 'ADMIN') {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchRequestsPeriodically = () => {
      fetchRequests();

      const intervalId = setInterval(fetchRequests, 60000);

      return () => clearInterval(intervalId);
    };

    fetchRequestsPeriodically();
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [startDate, endDate, requests]);

  const fetchRequests = async () => {
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      );

      const response = await axios.get(`http://localhost:3333/requests/all`, {
        params: {
          startDate: format(startDate, 'MM/dd/yyyy'),
          endDate: format(endDate, 'MM/dd/yyyy'),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedRequests = response.data.requests.map((request: any) => ({
        ...request,
        created_at: format(new Date(request.created_at), 'dd/MM/yyyy HH:mm:ss'),
        status: getStatusCookie(request.id) // Get status from cookie or default to 'Em Aberto'
      }));
      setRequests(formattedRequests);
      setFilteredRequests(formattedRequests);
    } catch (error) {
      console.error('Erro ao buscar requests:', error);
    }
  };

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
              {filteredRequests.map((request: any, index: number) => (
                <Tr key={index} bgColor={getStatusColor(request.status)}>
                  <Td>{request.sequence}</Td>
                  <Td>{request.user_name}</Td>
                  <Td>
                    <ul>
                      {request.items.map((item: any, itemIndex: number) => (
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
