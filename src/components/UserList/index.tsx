import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Thead, Tbody, Tr, Th, Td, Box, Input, Flex } from '@chakra-ui/react';

const UserList = ({ onSelectUser }:any) => {
  const [users, setUsers] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterId, setFilterId] = useState('');
  const [userTotalPrices, setUserTotalPrices] = useState<any>({});
	const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
	const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  useEffect(() => {
    fetchUsers();
  }, [selectedMonth, selectedYear]);

  const fetchUsers = async () => {
		try {
			const token = document.cookie.replace(
				/(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
				'$1'
			);
	
			const response = await axios.get(`http://localhost:3333/users/all`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const fetchedUsers = response.data.users.user;
			setUsers(fetchedUsers);
	
			// Fetch total price sum for each user
			const userTotalPricePromises = fetchedUsers.map((user:any) => {
				return axios.get(`http://localhost:3333/total-price-sum/${user.id}/${String(selectedMonth)}/${String(selectedYear)}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
			});
	
			const totalPricesResponses = await Promise.all(userTotalPricePromises);
			const userTotalPricesData = totalPricesResponses.reduce((acc, response, index) => {
				acc[fetchedUsers[index].id] = response.data.totalPriceSum;
				return acc;
			}, {});
	
			setUserTotalPrices(userTotalPricesData);
		} catch (error) {
			console.error('Erro ao buscar usuários:', error);
		}
	};
	

  const handleSelectUser = (userId:any) => {
    onSelectUser(userId);
  };

  const handleFilterName = (event:any) => {
    const value = event.target.value;
    setFilterName(value);
  };

  const handleFilterId = (event:any) => {
    const value = event.target.value;
    setFilterId(value);
  };

	const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2)}`;
  };

  const filteredUsers = users.filter((user:any) => {
    return user.name.toLowerCase().includes(filterName.toLowerCase()) && user.id.includes(filterId);
  });

  return (
    <Box p="4" bg="gray.100" borderRadius="md">
      <Flex mb="4">
        <Input placeholder="Filtrar por nome" value={filterName} onChange={handleFilterName} mr="2" />
        <Input placeholder="Filtrar por ID" value={filterId} onChange={handleFilterId} />
				<Input
					type="number"
					min="1"
					max="12"
					placeholder="Mês"
					value={selectedMonth}
					onChange={(e) => {
						setSelectedMonth(e.target.value);
						fetchUsers(); // Chama fetchUsers quando o valor do mês é alterado
					}}
				/>
				<Input
					type="number"
					placeholder="Ano"
					value={selectedYear}
					onChange={(e) => {
						setSelectedYear(e.target.value);
						fetchUsers(); // Chama fetchUsers quando o valor do ano é alterado
					}}
				/>
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Nome</Th>
            <Th>Fatura Total</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredUsers.map((user:any, index:number) => (
            <Tr key={index}>
              <Td>{user.id}</Td>
              <Td>{user.name}</Td>
              <Td>{formatPrice(userTotalPrices[user.id] || 0)}</Td>
              <Td>
                <Button onClick={() => handleSelectUser(user.id)}>Selecionar</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default UserList;
