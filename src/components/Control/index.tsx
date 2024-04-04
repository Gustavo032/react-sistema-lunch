import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Thead, Tbody, Tr, Th, Td, Box, Input, Flex } from '@chakra-ui/react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import UserList from '../UserList';

const Control = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (userId) {
      fetchRequests();
    }
  }, [currentPage, userId]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      );

      const response = await axios.get(`http://localhost:3333/requests/history?page=${currentPage}&userId=${userId}`, {
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
      setFilteredRequests(formattedRequests); // Atualiza filteredRequests com os dados recebidos
    } catch (error) {
      console.error('Erro ao buscar requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (selectedUserId:any) => {
    setUserId(selectedUserId);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1); // Atualiza a página atual
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => prevPage - 1); // Atualiza a página atual
  };

	const exportToExcel = async () => {
		try {
			const totalRequests = [];
			let currentPage = 1;
			let hasNextPage = true;
	
			while (hasNextPage) {
				const token = document.cookie.replace(
					/(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
					'$1'
				);
				const response = await axios.get(`http://localhost:3333/requests/history?page=${currentPage}&userId=fc44f8c3-b695-4ba4-9192-2fb6bdfe2ddb`, {
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
						title: item.title.replace(/"/g, ''), // Remover aspas duplas dos títulos
						price: parseFloat(item.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
					}))
				}));
	
				totalRequests.push(...formattedRequests);
	
				currentPage++;
				hasNextPage = response.data.requests.length > 0;
			}
	
			const requestsForExport = totalRequests.map((request) => ({
				"ID": request.id,
				"Usuário": request.user_name,
				"Itens": request.items.map((item:any) => `${item.title} - ${item.price}`).join("\n"),
				"Preço Total": request.total_price,
				"Data de Criação": request.created_at
			}));
	
			const worksheet = XLSX.utils.json_to_sheet(requestsForExport);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, `Relatório Pedidos`);
			XLSX.writeFile(workbook, `pedidos.xlsx`);
	
		} catch (error) {
			console.error('Erro ao exportar para Excel:', error);
		}
	};

	const handleStartDateChange = (event:any) => {
    const value = event.target.value;
    setStartDate(value);
    filterRequests(value, endDate); // Atualiza os dados filtrados
  };

  const handleEndDateChange = (event:any) => {
    const value = event.target.value;
    setEndDate(value);
    filterRequests(startDate, value); // Atualiza os dados filtrados
  };

  const filterRequests = (start:string, end:string) => {
    let filtered = requests;
    if (start && end) {
      filtered = requests.filter((request:any) => {
        const requestDate = new Date(request.created_at);
        const startDateObj = new Date(start);
        const endDateObj = new Date(end);
        return requestDate >= startDateObj && requestDate <= endDateObj;
      });
    }
    setFilteredRequests(filtered);
  };

  return (
    <Box p="4">
      {!userId ? (
        <UserList onSelectUser={handleSelectUser} />
      ) : (
        <>
          <Flex mb="4">
            <Button onClick={() => setUserId(null)} mr="2">&#8592; Voltar para seleção de usuários</Button>
            <Input type="date" value={startDate} onChange={handleStartDateChange} mr="2" />
            <Input type="date" value={endDate} onChange={handleEndDateChange} />
          </Flex>
          <Box p="4" bg="gray.100" borderRadius="md">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Usuário</Th>
                  <Th>Itens</Th>
                  <Th>Preço Total</Th>
                  <Th>Data de Criação</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredRequests.map((request:any, index:number) => (
                  <Tr key={index}>
                    <Td>{request.id}</Td>
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
          <Flex justify="center" mt="4">
            <Button onClick={handlePreviousPage} disabled={currentPage === 1} mr="2">Página Anterior</Button>
            <Button onClick={handleNextPage}>Próxima Página</Button>
            <Button onClick={exportToExcel} ml="2">Exportar Planilha</Button>
          </Flex>
        </>
      )}
    </Box>
  );
};

export default Control;

