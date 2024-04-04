import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Thead, Tbody, Tr, Th, Td, Box, Input, Flex } from '@chakra-ui/react';

const UserList = ({ onSelectUser }:any) => {
  const [users, setUsers] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterId, setFilterId] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      );

      const response = await axios.get('http://localhost:3333/users/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.users.user);
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

  const filteredUsers = users.filter((user:any) => {
    return user.name.toLowerCase().includes(filterName.toLowerCase()) && user.id.includes(filterId);
  });

  return (
    <Box p="4" bg="gray.100" borderRadius="md">
      <Flex mb="4">
        <Input placeholder="Filtrar por nome" value={filterName} onChange={handleFilterName} mr="2" />
        <Input placeholder="Filtrar por ID" value={filterId} onChange={handleFilterId} />
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Nome</Th>
            <Th>Email</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredUsers.map((user:any, index:number) => (
            <Tr key={index}>
              <Td>{user.id}</Td>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
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