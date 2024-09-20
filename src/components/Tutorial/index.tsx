import React from 'react';
import { Box, Heading, Text, VStack, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';

const Tutorial: React.FC = () => {
  return (
    <Box maxW="800px" mx="auto" mt={10} p={5} bg="gray.50" borderRadius="md" boxShadow="md">
      <Heading as="h1" size="xl" mb={6} textAlign="center" color="teal.600">
        Documentação do Sistema - Tutorial Completo
      </Heading>

      <Accordion allowToggle>
        {/* Verificar Pedidos em Tempo Real */}
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold">
                Verificar Pedidos em Tempo Real
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>
              Nesta funcionalidade, você consegue ver todos os pedidos em tempo real, podendo filtrar por nome. 
              Aqui também é possível:
            </Text>
            <VStack spacing={2} align="left" mt={3}>
              <Text>- Alterar o status de um pedido (apenas localmente, não salva no banco de dados).</Text>
              <Text>- Excluir um pedido do dia, caso necessário.</Text>
              <Text>- Verificar a foto do usuário que realizou o pedido.</Text>
            </VStack>
          </AccordionPanel>
        </AccordionItem>

        {/* Cadastrar Item */}
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold">
                Cadastrar Item
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>
              Ao clicar em "Adicionar Item", você pode adicionar novos itens ao cardápio, como Pão de Queijo ou Suco de Copo. 
              Você também pode:
            </Text>
            <VStack spacing={2} align="left" mt={3}>
              <Text>- Editar o valor das refeições padrão (Almoço, Café da Tarde, etc.).</Text>
              <Text>- Excluir itens avulsos do cardápio quando não forem mais necessários.</Text>
            </VStack>
          </AccordionPanel>
        </AccordionItem>

        {/* Solicitar uma Refeição */}
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold">
                Solicitar uma Refeição
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>
              Essa tela simula o totem onde os usuários podem fazer pedidos de forma online. As opções são:
            </Text>
            <VStack spacing={2} align="left" mt={3}>
              <Text>- Café da Manhã</Text>
              <Text>- Almoço</Text>
              <Text>- Café da Tarde</Text>
              <Text>- Cantina (com itens avulsos que podem ser escolhidos da lista)</Text>
            </VStack>
            <Text mt={3}>
              O processo é simples: o usuário escolhe as refeições e vê um resumo do pedido antes de confirmar.
              Se for feito no totem, ao final ele pode imprimir o ticket.
            </Text>
          </AccordionPanel>
        </AccordionItem>

        {/* Criar Usuário */}
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold">
                Criar Usuário
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>
              Aqui você pode cadastrar novos usuários no sistema. O formulário de cadastro exige:
            </Text>
            <VStack mb={3} spacing={2} align="left" mt={3}>
              <Text>- Foto (deve seguir algumas orientações, como fundo claro e sem padrões).</Text>
              <Text>- Nome completo, CPF, Email e outras informações dos pais.</Text>
              <Text>- Após o cadastro, o usuário já pode utilizar o sistema com reconhecimento facial.</Text>
            </VStack>
						<Text as="span"><b>{"Detalhe:"}</b>{" Caso retorne um pop-up vermelho o sistema pode ter caído (deve ser necessário contatar o suporte), senão o sistema retornará um pop-up verde (sucesso)"}</Text>
          </AccordionPanel>
        </AccordionItem>

        {/* Gerenciar Tokens */}
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold">
                Gerenciar Tokens
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>
              Essa funcionalidade permite criar tokens de auto-cadastro, para que os usuários possam se registrar 
              no sistema sem o intermédio de um administrador.
            </Text>
            <VStack spacing={2} align="left" mt={3}>
              <Text>- Cada token é enviado por e-mail, contendo um link para o cadastro.</Text>
              <Text>- O usuário segue o link, tira uma foto e preenche as informações solicitadas.</Text>
            </VStack>
          </AccordionPanel>
        </AccordionItem>

        {/* Controle Geral */}
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold">
                Controle Geral
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>
              No Controle Geral, você pode visualizar todos os usuários cadastrados e gerenciar suas informações.
              Funções principais:
            </Text>
            <VStack spacing={2} align="left" mt={3}>
              <Text>- Ver o total gasto por cada usuário e o total geral.</Text>
              <Text>- Editar dados do usuário, como nome, CPF e informações dos pais.</Text>
              <Text>- Excluir um usuário do sistema, o que apaga todas as suas informações e pedidos.</Text>
              <Text>- Filtrar usuários por nome, ID ou intervalo de datas.</Text>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
				{/* Permissões */}
				<AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold">
                Permissões
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>
              As permissões de acesso variam conforme o tipo de usuário:
            </Text>
            <VStack spacing={2} align="left" mt={3}>
              <Text>- <strong>Professores</strong>: Acesso a "Gerenciar Tokens" e "Solicitar uma Refeição".</Text>
              <Text>- <strong>Cantina</strong>: Acesso a "Gerenciar Tokens", pedidos em tempo real, cadastrar item, solicitar uma refeição e criar usuário.</Text>
              <Text>- <strong>Admin</strong>: Acesso total a todas as páginas do sistema.</Text>
              <Text>- <strong>Alunos</strong>: Acesso apenas à opção "Solicitar uma Refeição".</Text>
            </VStack>
          </AccordionPanel>
        </AccordionItem>

      </Accordion>
    </Box>
  );
};

export default Tutorial;
