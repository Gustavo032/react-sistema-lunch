import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { Button, Table, Thead, Tbody, Tr, Th, Td, Box, Input, Flex, Icon, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, useToast, Image, Text, FormLabel, FormControl, Select, Stack, Heading, Center, Avatar, AvatarBadge, IconButton, useColorModeValue } from '@chakra-ui/react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { SmallCloseIcon } from '@chakra-ui/icons';

const UserList = ({ onSelectUser }:any) => {
  const [users, setUsers] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterId, setFilterId] = useState('');
  const [userTotalPrices, setUserTotalPrices] = useState<any>({});
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState<any>({});
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<any>('');
  const toast = useToast();
  const cancelRef = useRef(null);
  const { onClose } = useDisclosure();

  useEffect(() => {
    fetchUsers();
  }, [selectedMonth, selectedYear]);

  const fetchUsers = async () => {
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      );

      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchedUsers = response.data.users.user;
      setUsers(fetchedUsers);

      const userTotalPricePromises = fetchedUsers.map((user:any) => {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/total-price-sum/${user.id}/${String(selectedMonth)}/${String(selectedYear)}`, {
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

  const handleModifyUser = (user:any) => {
    setSelectedUser(user);
    setIsModifyModalOpen(true);
  };

  const handleCloseModifyModal = () => {
    setIsModifyModalOpen(false);
  };

  const handleFilterName = (event:any) => {
    const value = event.target.value;
    setFilterName(value);
  };

  const handleFilterId = (event:any) => {
    const value = event.target.value;
    setFilterId(value);
  };

  const formatPrice = (price:any) => {
    return `R$ ${price.toFixed(2)}`;
  };

  const filteredUsers = users.filter((user:any) => {
    return user.name.toLowerCase().includes(filterName.toLowerCase()) && user.id.includes(filterId);
  });

  const handleImageChange = async (e:any) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.includes('image')) {
      alert('Por favor, selecione uma imagem.');
      return;
    }

    if (file.size > 200 * 1024) {
      const compressedFile = await imageCompression(file, { maxSizeMB: 0.1 });
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setSelectedUser({ ...selectedUser, image: reader.result });
      };
      reader.readAsDataURL(compressedFile);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setSelectedUser({ ...selectedUser, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteUser = async (userId:any) => {
    onClose();
    try {
			const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      );

      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/users/${userId}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: 'Usuário excluído com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchUsers();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };

  const handleUpdateUser = async (updatedUser:any) => {
    try {
			const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)refreshToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      );

      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/users/${updatedUser.id}/update`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: 'Usuário atualizado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchUsers();
      handleCloseModifyModal();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  const totalFatura = Object.values(userTotalPrices).reduce((sum:any, price:any) => sum + price, 0);

  return (
    <Box p="4" bg="gray.100" borderRadius="md" border="solid gray 0.16rem">
      <Flex mb="4" w="100%" justifyContent={"space-between"}>
        <Flex w="30%" justify={"center"}>
          <Input placeholder="Filtrar por ID" value={filterId} _placeholder={{ color: "gray.700" }} border="solid black 0.06rem" _focus={{ backgroundColor: "#fff" }} bgColor={"gray.200"} onChange={handleFilterId} mr="2" />
          <Input placeholder="Filtrar por nome" value={filterName} _placeholder={{ color: "gray.700" }} border="solid black 0.06rem" _focus={{ backgroundColor: "#fff" }} bgColor={"gray.200"} onChange={handleFilterName} />
        </Flex>

        <Flex justify="center" bgColor="gray.100" w="20%" borderRadius="9999999px">
          <Image src="/Logo_Maple_Bear.png" h="3rem" />
        </Flex>

        <Flex w="30%" justify={"center"}>
          <Flex width="100%" h="100%" align={"center"} ml="2" bgColor="gray.300" p="0 1rem" border="solid gray 0.05rem" borderRadius={"0.25rem"} justify={"center"}>
            <Text as={FormLabel} mt="0.5rem" htmlFor="inputMes" mr="1rem">Mês:</Text>
            <Input
              id="inputMes"
              type="number"
              min="1"
              max="12"
              bgColor="#fff"
              placeholder="Mês"
              border="solid 0.12rem black"
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                fetchUsers();
              }}
            />
          </Flex>

          <Flex width="100%" h="100%" alignItems="center" ml="2" bgColor="gray.300" p="0 1rem" border="solid gray 0.05rem" borderRadius={"0.25rem"} justify={"center"}>
            <Text as={FormLabel} mt="0.5rem" htmlFor="inputAno" mr="1rem">Ano:</Text>
            <Input
              id="inputAno"
              type="number"
              placeholder="Ano"
              bgColor="#fff"
              border="solid 0.12rem black"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                fetchUsers();
              }}
            />
          </Flex>
        </Flex>
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Nome</Th>
            <Th>Fatura Total <Text fontSize="1.20rem" color="blue.500" fontWeight="600">{formatPrice(totalFatura)}</Text></Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredUsers.map((user:any) => (
            <Tr key={user.id}>
              <Td>{user.id}</Td>
              <Td>{user.name}</Td>
              <Td>{formatPrice(userTotalPrices[user.id] || 0)}</Td>
              <Td>
                <Button size="sm" colorScheme="blue" mr="2" onClick={() => handleModifyUser(user)} leftIcon={<FaEdit />}>Editar</Button>
                <Button size="sm" colorScheme="red" onClick={() => setSelectedUserId(user.id)} leftIcon={<FaTrash />}>Excluir</Button>
              </Td>
							<Td>
                <Button onClick={() => handleSelectUser(user.id)} bgColor="teal.500" color="white">Ver Detalhes</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <AlertDialog
        isOpen={selectedUserId !== null}
        leastDestructiveRef={cancelRef}
        onClose={() => setSelectedUserId(null)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">Excluir Usuário</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>Tem certeza que deseja excluir este usuário?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setSelectedUserId(null)}>Cancelar</Button>
							<Button colorScheme='red' ml={3} onClick={() => {handleDeleteUser(selectedUserId); setSelectedUserId(null);}}>Excluir</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <AlertDialog
        isOpen={isModifyModalOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleCloseModifyModal}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">Editar Usuário</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              <Flex justify="center">
                <Center w="full" py={6}>
                  <Box w="full" bg={useColorModeValue('white', 'gray.800')} rounded="lg" p={6}>
									<Stack direction={['column', 'row']} spacing={6}>
										<Center>
											<Avatar size="xl"  src={imagePreview.length === 0 ? imagePreview : selectedUser.image}>
												<AvatarBadge
													as={IconButton}
													size="sm"
													rounded="full"
													top="-10px"
													colorScheme="red"
													aria-label="remove Image"
													icon={<SmallCloseIcon onClick={() => setImagePreview('')}/>}
												/>
											</Avatar>
										</Center>
										<Center w="100%">
											<Input p="0.1rem" accept="image/*" onChange={handleImageChange} alignContent={"center"} type="file" w="59%" border="none"/>
										</Center>
									</Stack>
									  {/* <Box mt={-12} pos="relative">
                      <Avatar size="xl" src={imagePreview} mb={4} pos="relative" _after={{
                        content: '""',
                        w: 4,
                        h: 4,
                        bg: 'green.300',
                        border: '2px solid white',
                        rounded: 'full',
                        pos: 'absolute',
                        bottom: 0,
                        right: 3,
                      }} />
                      <Center>
                        <IconButton colorScheme="teal" aria-label="Edit Image" icon={<SmallCloseIcon />} onClick={() => setImagePreview('')} />
                      </Center>
                      <Input type="file" accept="image/*" onChange={handleImageChange} />
                    </Box> */}
                    <Stack spacing={4} mt={8}>
											<FormControl>
												<FormLabel>Nome</FormLabel>
												<Input 
													value={selectedUser.name ? selectedUser.name : '' } 
													onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
												/>
											</FormControl>
											<FormControl>
												<FormLabel>Email</FormLabel>
												<Input 
													value={selectedUser.email ? selectedUser.email : '' } 
													onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
												/>
											</FormControl>
											<FormControl>
												<FormLabel>Senha</FormLabel>
												<Input 
													value={selectedUser.password ? selectedUser.password : '' } 
													onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
												/>
											</FormControl>
											<FormControl>
												<FormLabel>Limite de crédito</FormLabel>
												<Input 
													type="number"
													value={selectedUser.credit_limit ? selectedUser.credit_limit : '' } 
													onChange={(e) => setSelectedUser({ ...selectedUser, credit_limit: e.target.value })}
												/>
											</FormControl>
											<FormControl>
												<FormLabel>Função</FormLabel>
												<Select
													value={selectedUser.role ? selectedUser.role : '' } 
													onChange={(e:any) => setSelectedUser({ ...selectedUser, role: e.target.value })}
												>
													<option value="ADMIN">Administrador</option>
													<option value="MIDDLE">Cantina</option>
													<option value="MEMBER">Aluno</option>
												</Select>
											</FormControl>
                    </Stack>
                  </Box>
                </Center>
              </Flex>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCloseModifyModal}>Cancelar</Button>
              <Button colorScheme="blue" ml={3} onClick={() => handleUpdateUser(selectedUser)}>Salvar</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default UserList;
