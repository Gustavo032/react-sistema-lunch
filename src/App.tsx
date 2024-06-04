import * as React from "react"
import { useState } from "react";
import {
  ChakraProvider,
  theme,
} from "@chakra-ui/react"
import LoginScreen from "./components/Login"
import { 	Route, Routes } from "react-router-dom"
import NotFound from "./components/notFound"
import { ReadQRCode } from "./components/ValidateCheckIn"
import { RequestScreen } from "./components/RequestScreen"
import MealOptionPage from "./components/MealOptionPage"
import { TicketScreen } from "./components/TicketScreen"
import Control from "./components/Control";
import UserList from "./components/UserList";
import CreateUserScreen from "./components/CreateUser";
import CreateItemScreen from "./components/CreateItem";
import AllRequests from "./components/AllRequests";
import Initial from "./components/Initial";
import AdminDashboard from "./components/AdminDash";

export const App = () => {
  const [ticketData, setTicketData] = useState<any>(null);
	window.history.forward(); 

  return(
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Initial />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/dashboard" element={<RequestScreen />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* <Route path="/validateCheckIn" element={<ReadQRCode />} /> */}
        <Route path="/mealOptionPage/:option" element={<MealOptionPage ticketData={ticketData} setTicketData={setTicketData} />} />
        <Route path="/ticket" element={<TicketScreen ticketData={ticketData} />} />
        <Route path="/controle" element={<Control />} />
        <Route path="/allRequests" element={<AllRequests />} />
        {/* <Route path="/userList" element={<UserList />} /> */}
        <Route path="/createUser" element={<CreateUserScreen />} />
        <Route path="/createItem" element={<CreateItemScreen />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </ChakraProvider>
  )
}

export default App;
