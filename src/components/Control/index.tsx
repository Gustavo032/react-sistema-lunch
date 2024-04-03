import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import UserList from '../UserList';

const Control = () => {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userId, setUserId] = useState(null); // Adiciona estado para armazenar o ID do usuário selecionado

  useEffect(() => {
    if (userId) { // Verifica se há um usuário selecionado antes de fazer a requisição dos pedidos
      fetchRequests();
    }
  }, [currentPage, userId]); // Adiciona userId como dependência do useEffect

  const fetchRequests = async () => {
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      );

      const response = await axios.get(`http://localhost:3333/requests/history?page=${currentPage}&userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Format dates and prices before setting the state
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
    } catch (error) {
      console.error('Erro ao buscar requests:', error);
    }
  };

	const handleSelectUser = (selectedUserId:any) => {
    setUserId(selectedUserId); // Atualiza o estado userId com o ID do usuário selecionado
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
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
				const response = await axios.get(`http://localhost:3333/requests/history?page=${currentPage}=userId=fc44f8c3-b695-4ba4-9192-2fb6bdfe2ddb`, {
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
	
			const requestsByPage = totalRequests.reduce((acc, request) => {
				const page = acc[request.page] || [];
				acc[request.page] = [...page, request];
				return acc;
			}, {});
	
			Object.entries(requestsByPage).forEach(([pageNumber, requests]:any) => {
				const dataForExport = requests.map((request:any) => ({
					"ID": request.id,
					"Usuário": request.user_name,
					"Itens": request.items.map((item:any) => `${item.title} - ${item.price}`).join("\n"),
					"Preço Total": request.total_price,
					"Data de Criação": request.created_at
				}));
	
				const worksheet = XLSX.utils.json_to_sheet(dataForExport);
				const workbook = XLSX.utils.book_new();
				XLSX.utils.book_append_sheet(workbook, worksheet, `Relatório Pedidos`);
				XLSX.writeFile(workbook, `pedidos.xlsx`);
			});
	
		} catch (error) {
			console.error('Erro ao exportar para Excel:', error);
		}
	};
	
	

  return (
    <>
		
			<UserList onSelectUser={handleSelectUser} /> {/* Renderiza o componente UserList e passa a função handleSelectUser */}
      {/* Restante do código */}
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
          {requests.map((request:any, index) => (
            <Tr key={index}>
              <Td>{request.id}</Td>
              <Td>{request.user_name}</Td>
              <Td>
                <ul>
                  {request.items.map((item:any, itemIndex:any) => (
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
      <Button onClick={handlePreviousPage} disabled={currentPage === 1} mr="2">Página Anterior</Button>
      <Button onClick={handleNextPage}>Próxima Página</Button>
      <Button onClick={exportToExcel} mt="2">Exportar Planilha</Button>
    </>
  );
};

export default Control;