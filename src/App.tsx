import * as React from "react"
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import LoginScreen from "./components/Login"
import { 	Route, Routes } from "react-router-dom"
import NotFound from "./components/notFound"
import {PrintCheckIn}  from "./components/PrintCheckIn"
// import ReadQRCode from "./components/ValidateCheckIn"

export const App = () => (
  <ChakraProvider theme={theme}>
		<Routes>
        <Route path="/" element={<LoginScreen/>} />
        <Route path="/dashboard" element={<PrintCheckIn/>} />
        {/* <Route path="/validateCheckIn" element={<ReadQRCode/>} /> */}
        <Route path="/*" element={<NotFound/>} />
    </Routes>
  </ChakraProvider>
)
