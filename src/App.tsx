import * as React from "react"
import {
  ChakraProvider,
  theme,
} from "@chakra-ui/react"
import LoginScreen from "./components/Login"
import { 	Route, Routes } from "react-router-dom"
import NotFound from "./components/notFound"
import { ReadQRCode } from "./components/ValidateCheckIn"
import { RequestScreen } from "./components/RequestScreen"
// import ReadQRCode from "./components/ValidateCheckIn"

export const App = () => (
  <ChakraProvider theme={theme}>
		<Routes>
        <Route path="/" element={<LoginScreen/>} />
        <Route path="/dashboard" element={<RequestScreen />} />
        <Route path="/validateCheckIn" element={<ReadQRCode />} />
        <Route path="/validateCheckIn" element={<ReadQRCode />} />
        <Route path="/*" element={<NotFound/>} />
    </Routes>
  </ChakraProvider>
)
