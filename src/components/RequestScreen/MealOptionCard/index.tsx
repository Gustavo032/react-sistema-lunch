import { Box, Text, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { TbClockOff } from "react-icons/tb";

export function MealOptionCard(props: any) {
  const [hovered, setHovered] = useState(false);
  const [isBreakfastTime, setIsBreakfastTime] = useState(false);
  const [isLunchTime, setIsLunchTime] = useState(false);
  const [isAfternoonTeaTime, setIsAfternoonTeaTime] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const checkMealTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    setIsBreakfastTime(hours >= 6 && (hours < 9 || (hours === 10 && minutes <= 59)));
    setIsLunchTime(hours >= 6 && (hours < 19 || (hours === 19 && minutes <= 30)));
    setIsAfternoonTeaTime(hours >= 6 && hours < 19);
  };

  useEffect(() => {
    checkMealTime();
  }, []);

  return (
    <Flex
      as={Link}
      to={`/mealOptionPage/${props.option}`}
      direction="column"
      position="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      borderRadius="0.55rem"
      border="white 0.12rem solid"
      pointerEvents={
        (props.option === "option1" && !isBreakfastTime) ||
        (props.option === "option2" && !isLunchTime) ||
        (props.option === "option3" && !isAfternoonTeaTime)
          ? "none"
          : "auto"
      }
      mb="0.25rem"
      overflow="hidden" // Adiciona overflow hidden para a rolagem
      flex="1 1 0"
    >
      <Box
        backgroundImage={`${props.backgroundImage}`}
        bgSize="cover"
        bgPos="center"
        borderRadius="0.55rem"
        h="100%"
        position="relative"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex="1"
          bg={
            (props.option === "option1" && !isBreakfastTime) ||
            (props.option === "option2" && !isLunchTime) ||
            (props.option === "option3" && !isAfternoonTeaTime)
              ? "rgba(0, 0, 0, 0.8)"
              : "rgba(0, 0, 0, 0.1)"
          }
          borderRadius="0.55rem"
        />

        {(props.option === "option1" && !isBreakfastTime) ||
        (props.option === "option2" && !isLunchTime) ||
        (props.option === "option3" && !isAfternoonTeaTime) ? (
          <Flex
            direction="column"
            justify="center"
            align="center"
            position="relative"
            zIndex="2"
            minHeight="100%"
            textAlign="center"
            minWidth="100%"
            textShadow="1rem 1rem 1rem black"
            p="1rem"
          >
            <TbClockOff color="#fff" size="50%" />
            <Text color="white" fontSize="1.2rem" mt="0.5rem">
              Tempo esgotado
            </Text>
          </Flex>
        ) : (
          <Text
            textShadow="0rem 0rem 2rem black"
            userSelect="none"
            textAlign="center"
            fontSize={{ base: "1rem", md: "2rem" }}
            fontWeight="bold"
            color="white"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            zIndex="1"
          >
            {props.text}
          </Text>
        )}
      </Box>
    </Flex>
  );
}
