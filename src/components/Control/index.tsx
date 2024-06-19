import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Thead, Tbody, Tr, Th, Td, Box, Flex, Text, Image, FormLabel } from '@chakra-ui/react';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import * as XLSX from 'xlsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import UserList from '../UserList';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

const Control = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userId, setUserId] = useState(null);
  // const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date | null>(endOfMonth(new Date()));
  const [totalPriceSum, setTotalPriceSum] = useState(0);
	const navigate = useNavigate();

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
    const getCookie = (name: string): string | undefined => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(';').shift();
      }
    };

    const userRole = getCookie('userRole');
    if (userRole !== 'ADMIN') {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (userId) {
      fetchRequests();
    }
  }, [currentPage, userId, startDate, endDate]);

  useEffect(() => {
    calculateTotalPriceSum();
  }, [requests]);

  const fetchRequests = async () => {
    try {
      // setLoading(true);
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/, '$1');

      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/requests/history`, {
        params: {
          page: currentPage,
          userId: userId,
          startDate: startDate ? format(startDate, 'MM/dd/yyyy') : null,
          endDate: endDate ? format(endDate, 'MM/dd/yyyy') : null,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedRequests = response.data.requests.map((request:any) => ({
        ...request,
        created_at: format(new Date(request.created_at), 'dd/MM/yyyy HH:mm:ss'),
        total_price: parseFloat(request.total_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        items: request.items.map((item:any) => ({
          ...item,
          price: parseFloat(item.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        }))
      }));
      setRequests(formattedRequests);
      setFilteredRequests(formattedRequests);
    } catch (error) {
      console.error('Erro ao buscar requests:', error);
    } finally {
      // setLoading(false);
    }
  };

	const formatCurrency = (value:any) => {
    return parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const calculateTotalPriceSum = () => {
    const sum = requests.reduce((accumulator, request:any) => {
      return accumulator + parseFloat(request.total_price.replace('R$', '').replace('.', '').replace(',', '.'));
    }, 0);
    setTotalPriceSum(sum);
  };

  const handleSelectUser = (selectedUserId:any) => {
    setUserId(selectedUserId);
    setCurrentPage(1);
  };

  const exportToExcel = async () => {
    try {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/, '$1');

      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/requests/history`, {
        params: {
          page: currentPage,
          userId: userId,
          startDate: startDate,
          endDate: endDate
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const requestsForExport = response.data.requests.map((request:any) => ({
        "ID": request.id,
        "Usuário": request.user_name,
        "Itens": request.requestItems.map((item:any) => `${item.itemTitle} - ${formatCurrency(item.itemPrice)}`).join("\n"), // Formata o preço de cada item
        "Preço Total": formatCurrency(request.total_price), // Formata o valor total
        "Data de Criação": format(new Date(request.created_at), 'dd/MM/yyyy HH:mm:ss')
      }));

      const worksheet = XLSX.utils.json_to_sheet(requestsForExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, `Relatório Pedidos`);
      XLSX.writeFile(workbook, `pedidos.xlsx`);

    } catch (error) {
      console.error('Erro ao exportar para Excel:', error);
    }
  };

  const handleStartDateChange = (date:any) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    setStartDate(startOfDay);
    filterRequests(startOfDay, endDate);
  };

  const handleEndDateChange = (date:any) => {
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    setEndDate(endOfDay);
    filterRequests(startDate, endOfDay);
  };

	const handleDelete = async (requestId: string) => {
		const token = document.cookie.replace(/(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
		
    if (window.confirm("Tem certeza que deseja excluir este pedido?")) {
      try {
        await axios.delete(`http://localhost:3333/requests/${requestId}/delete`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
        setRequests((prevRequests) => prevRequests.filter((request: any) => request.id !== requestId));
        setFilteredRequests((prevRequests) => prevRequests.filter((request: any) => request.id !== requestId));
        calculateTotalPriceSum();
      } catch (error) {
        console.error('Erro ao excluir pedido:', error);
      }
    }
  };

  const filterRequests = (start:any, end:any) => {
    let filtered = requests;
    if (start && end) {
      filtered = requests.filter((request:any) => {
        const requestDate = new Date(request.created_at);
        return requestDate >= start && requestDate <= end;
      });
    } else if (start && !end) {
      filtered = requests.filter((request:any) => {
        const requestDate = new Date(request.created_at);
        return requestDate >= start;
      });
    } else if (!start && end) {
      filtered = requests.filter((request:any) => {
        const requestDate = new Date(request.created_at);
        return requestDate <= end;
      });
    }
    setFilteredRequests(filtered);
  };

  // const handlePrintTicket = async () => {
  //   try {
  //     const requestData = {
  //       requestId: '2438cd7a-f782-4685-95f2-a6573c92332d',
  //       user: 'Gustavo Ramos Silva Santos',
  //       dateTime: '15/04/2024, 14:19:04',
  //       items: [
  //           { name: 'Fruta', quantity: 1, price: 3 },
  //           { name: 'Suco', quantity: 1, price: 5 },
  //           { name: 'Sorvete', quantity: 1, price: 12 },
  //           { name: 'Açaí', quantity: 1, price: 12 },
  //           { name: 'Salgado', quantity: 1, price: 9 },
  //           { name: 'Lanche do Dia', quantity: 1, price: 15 }
  //       ],
  //       total: 56
  //     };

  //     await axios.post('http://localhost:3003/printTicket', requestData);
  //     console.log("Ticket impresso com sucesso!");
  //   } catch (error) {
  //     console.error("Erro ao imprimir o ticket:", error);
  //   }
  // };

  return (
    <Box p="4" bgColor="gray.900" minH="100vh">
			<Flex w="100%" justifyContent={"space-between"} align={"center"}>	
				<Button
					colorScheme="whiteAlpha"
					onClick={() => navigate('/admin')}
					zIndex="2"
					h="3rem"
					mr="1rem"
					mb="1rem"
					_hover={{ bg: 'whiteAlpha.800' }}
					_active={{ bg: 'whiteAlpha.600' }}
					>
					<ArrowBackIcon color="white" boxSize={6} />
				</Button>
				<Button as={Link} to="/createUser" colorScheme="green">Criar Usuário</Button>
			</Flex>
      {!userId ? (
        <UserList onSelectUser={handleSelectUser} />
      ) : (
        <>
          <Flex mb="4" alignItems="center" justifyContent={"space-between"}>
            <Button border="solid gray 0.16rem" onClick={() => setUserId(null)} mr="2" h="3rem" w="4rem" bgColor="gray.100">&#8592;</Button>

            <Flex justify="center" bgColor="gray.100" w="20%" border="solid gray 0.05rem" p="0.06rem 0" borderRadius="9999999px">
              <Image src="/Logo_Maple_Bear.png" h="3rem" />
            </Flex>
            <Flex w="50%" align="center" >
              <Flex width="100%" h="100%" alignItems="center" ml="2" border="solid gray 0.16rem" bgColor="gray.200" p="0.2rem" borderRadius={"0.25rem"} justify={"center"}>
                <Text as={FormLabel} mt="0.5rem" htmlFor="inputDateStart" mr="2">Data Inicial:</Text>
                <Box as={DatePicker} id="inputDateStart" bgColor="gray.100" width="100%" border="solid 0.12rem black" borderRadius={"0.25rem"} height="2.5rem" textAlign="center" selected={startDate} onChange={handleStartDateChange} dateFormat="dd/MM/yyyy" />
              </Flex>
              
              <Flex width="100%" h="100%" alignItems="center" ml="2" border="solid gray 0.16rem" bgColor="gray.200" p="0.2rem" borderRadius={"0.25rem"} justify={"center"}>
                <Text as={FormLabel} mt="0.5rem" htmlFor="inputDateEnd" ml="2" mr="2">Data Final:</Text>
                <Box as={DatePicker} id="inputDateEnd" bgColor="gray.100" width="100%" border="solid 0.12rem black" borderRadius={"0.25rem"} height="2.5rem" textAlign="center" selected={endDate} onChange={handleEndDateChange} dateFormat="dd/MM/yyyy" />
              </Flex>
            </Flex>
          </Flex>
          
          <Box p="4" bg="gray.300" borderRadius="md"  borderColor="gray.900" border="solid gray 0.16rem">
            <Table variant="simple"  borderColor="gray.900">
              <Thead  borderColor="gray.900">
                <Tr borderColor="gray.900">
                  <Th>Nº</Th>
                  <Th>Usuário</Th>
                  <Th>Itens</Th>
                  <Th>Preço Total: 	<Text fontSize="1.20rem" color="blue.500" fontWeight="600">{totalPriceSum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text></Th>
                  <Th>Data de Criação</Th>
                </Tr>
              </Thead>
              <Tbody  borderColor="gray.900">
                {filteredRequests.map((request:any, index:number) => (
                  <Tr _before={{
                    borderColor: '#000'
                  }}
                    key={index}>
                    <Td>{request.sequence}</Td>
                    <Td>{request.user_name}</Td>
                    <Td>
                      <ul>
                        {request.requestItems.map((item:any, itemIndex:number) => (
                          <li key={itemIndex}>{item.itemTitle} - {Number(item.itemPrice).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</li>
                        ))}
                      </ul>
                    </Td>
                    <Td>{request.total_price}</Td>
                    <Td>{request.created_at}</Td>
										<Td>
                    <Button colorScheme="red" onClick={() => handleDelete(request.id)}>Excluir</Button>
                  </Td>

                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          <Flex justify="center" mt="4">
            <Button onClick={exportToExcel} colorScheme='green' ml="2">Exportar Planilha</Button>
          </Flex>
        </>
      )}
    </Box>
  );
};

export default Control;
