import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Thead, Tbody, Tr, Th, Td, Box, Flex, Text, Image, FormLabel } from '@chakra-ui/react';
import { endOfDay, endOfMonth, format, startOfDay, startOfMonth } from 'date-fns';
import * as XLSX from 'xlsx';
import DatePicker from 'react-datepicker'; // Import from react-datepicker
import 'react-datepicker/dist/react-datepicker.css'; // Import styles
import UserList from '../UserList';

const AllRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
	const [startDate, setStartDate] = useState<Date>(startOfDay(new Date())); // Definindo startDate como o primeiro dia do mês atual
  const [endDate, setEndDate] = useState<Date>(endOfDay(new Date())); // Definindo endDate como o último dia do mês atual

  const [totalPriceSum, setTotalPriceSum] = useState(0); // Estado para armazenar a soma dos total_price


	useEffect(() => {
		// Define uma função para realizar o fetch dos pedidos
		const fetchRequestsPeriodically = () => {
			fetchRequests(); // Chama a função fetchRequests
	
			// Define o intervalo para chamar a função fetchRequests a cada 1 minuto (60000 milissegundos)
			const intervalId = setInterval(fetchRequests, 1000);
	
			// Retorna uma função que limpa o intervalo quando o componente for desmontado
			return () => clearInterval(intervalId);
		};
	
		// Chama a função fetchRequestsPeriodically quando o componente for montado
		fetchRequestsPeriodically();
	
		// Define as dependências como vazio para garantir que este efeito só seja executado uma vez
	}, []);

	
	useEffect(() => {
		fetchRequests();
  }, [startDate, endDate]);

  useEffect(() => {
    // Ao atualizar os pedidos, recalcula a soma dos total_price
    calculateTotalPriceSum();
  }, [requests]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const calculateTotalPriceSum = () => {
    const sum = requests.reduce((accumulator, request:any) => {
      return accumulator + parseFloat(request.total_price.replace('R$', '').replace('.', '').replace(',', '.'));
    }, 0);
    setTotalPriceSum(sum);
  };

  // const handleNextPage = () => {
  //   setCurrentPage(currentPage + 1);
  // };

	// const handlePreviousPage = () => {
  //   setCurrentPage(currentPage - 1);
  // };

	const formatCurrency = (value:any) => {
    return parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

	const exportToExcel = async () => {
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      );

      const response = await axios.get(`http://localhost:3333/requests/all`, {
        params: {
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
        "Itens": request.items.map((item:any) => `${item.title} - ${formatCurrency(item.price)}`).join("\n"), // Formata o preço de cada item
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
		// Define a hora de início como 00:00:00 do dia selecionado
		const startOfDay = new Date(date);
		startOfDay.setHours(0, 0, 0, 0);
		setStartDate(startOfDay);
		filterRequests(startOfDay, endDate);
	};

	const handleEndDateChange = (date:any) => {
		// Define a hora de término como 23:59:59 do dia selecionado
		const endOfDay = new Date(date);
		endOfDay.setHours(23, 59, 59, 999); // Definindo hora para o final do dia
		setEndDate(endOfDay);
		filterRequests(startDate, endOfDay);
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
		// Após atualizar o estado filteredRequests, chame fetchRequests
		// para buscar os dados atualizados do servidor
	};
	
	

  return (
    <Box p="4" bgColor="gray.900" minH="100vh">
        <>
          <Flex mb="4" alignItems="center" justifyContent={"space-between"}>
						{/* <Flex justifyContent="flex-end" mb="4">
							<Text>Total: {totalPriceSum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
						</Flex> */}
						<Flex justify="center" bgColor="gray.100" w="20%" border="solid gray 0.05rem" p="0.06rem 0" borderRadius="9999999px">
							<Image src="/Logo_Maple_Bear.png" h="3rem" />
						</Flex>
						{/* <Flex w="50%" align="center" >
							<Flex width="100%" h="100%" alignItems="center" ml="2" border="solid gray 0.16rem" bgColor="gray.200" p="0.2rem" borderRadius={"0.25rem"} justify={"center"}>
								<Text as={FormLabel} mt="0.5rem" htmlFor="inputDateStart" mr="2">Data Inicial:</Text>
								<Box as={DatePicker} id="inputDateStart" bgColor="gray.100" width="100%" border="solid 0.12rem black" borderRadius={"0.25rem"} height="2.5rem" textAlign="center" selected={startDate} onChange={handleStartDateChange} dateFormat="dd/MM/yyyy" />
							</Flex>
							
							<Flex width="100%" h="100%" alignItems="center" ml="2" border="solid gray 0.16rem" bgColor="gray.200" p="0.2rem" borderRadius={"0.25rem"} justify={"center"}>
								<Text as={FormLabel} mt="0.5rem" htmlFor="inputDateEnd" ml="2" mr="2">Data Final:</Text>
								<Box as={DatePicker} id="inputDateEnd" bgColor="gray.100" width="100%" border="solid 0.12rem black" borderRadius={"0.25rem"} height="2.5rem" textAlign="center" selected={endDate} onChange={handleEndDateChange} dateFormat="dd/MM/yyyy" />
							</Flex>
						</Flex>*/}
					</Flex> 
					
          <Box p="4" bg="gray.100" borderRadius="md" border="solid gray 0.16rem">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Nº</Th>
                  <Th>Usuário</Th>
                  <Th>Itens</Th>
                  <Th>Preço Total: 	<Text fontSize="1.20rem" color="blue.500" fontWeight="600">{totalPriceSum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text></Th>
                  <Th>Data de Criação</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredRequests.map((request:any, index:number) => (
                  <Tr key={index}>
                    <Td>{request.sequence}</Td>
                    <Td>{request.user_name}</Td>
                    <Td>
                      <ul>
                        {request.items.map((item:any, itemIndex:number) => (
                          <li key={itemIndex}>{item.title} - {item.price}</li>
                        ))}
                      </ul>
                    </Td>
                    <Td>{request.total_price}</Td>
                    <Td>{request.created_at}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          {/* <Flex justify="center" mt="4">
            <Button onClick={exportToExcel} colorScheme='green' ml="2">Exportar Planilha</Button>
          </Flex> */}
        </>
    </Box>
  );
};

export default AllRequests;
