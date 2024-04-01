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

export const App = () => {
  const [ticketData, setTicketData] = useState<any>(null);

  return(
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path="/" element={<LoginScreen/>} />
        <Route path="/dashboard" element={<RequestScreen />} />
        <Route path="/validateCheckIn" element={<ReadQRCode />} />
        <Route path="/mealOptionPage/:option" element={<MealOptionPage ticketData={ticketData} setTicketData={setTicketData} />} />
        <Route path="/ticket" element={<TicketScreen ticketData={ticketData} />} />
        <Route path="/*" element={<NotFound/>} />
      </Routes>
    </ChakraProvider>
  )
}

export default App;
