import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const UserList = ({ onSelectUser }:any) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      );

      const response = await axios.get('http://localhost:3333/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  return (
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
        {users.map((user:any, index) => (
          <Tr key={index}>
            <Td>{user.id}</Td>
            <Td>{user.name}</Td>
            <Td>{user.email}</Td>
            <Td>
              <Button onClick={() => onSelectUser(user.id)}>Selecionar</Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default UserList;