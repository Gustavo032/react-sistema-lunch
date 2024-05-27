import { Box, GridItem, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { TbClockOff } from "react-icons/tb";

export function MealOptionCard(props:any) {
  const [hovered, setHovered] = useState(false);
	const [isBreakfastTime, setIsBreakfastTime] = useState(true);
	const [isAlunchTime, setIsAlunchTime] = useState(true);
	const [isAfternoonTeaTime, setIsAfternoonTeaTime] = useState(true);
	
	
  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

	const checkMealTime = () => {
		const now = new Date();
		const hours = now.getHours();
		
		// Verificar se é hora do café da manhã (entre 8:00 e 11:00)
		if (hours >= 8 && hours < 19) {
			setIsBreakfastTime(true);
		}
	
		// Verificar se é hora do almoço (entre 10:00 e 13:00)
		if (hours >= 8 && hours < 19) {
			setIsAlunchTime(true);
		}
	
		// Verificar se é hora do café da tarde (entre 13:00 e 17:00)
		if (hours >= 8 && hours < 19) {
			setIsAfternoonTeaTime(true);
		}
	
		if(hours >= 18 && hours < 8){
			setIsBreakfastTime(true);
			setIsAlunchTime(true);
			setIsAfternoonTeaTime(true);
		}
	};
	

	useEffect(() => {
    checkMealTime();
  }, []);


  return (
		<GridItem
			as={Link}
			to={`/mealOptionPage/${props.option}`}
			position="relative"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			borderRadius="0.55rem"
			border="white 0.12rem solid"
			// Desativar link se não for hora da refeição correspondente
			pointerEvents={
				(props.option === "option1" && !isBreakfastTime) ||
				(props.option === "option2" && !isAlunchTime) ||
				(props.option === "option3" && !isAfternoonTeaTime)
					? "none"
					: "auto"
			}
		>
			<Box
				backgroundImage={`${props.backgroundImage}`}
				bgSize="cover"
				bgPos="center"
				borderRadius="0.55rem"
				h="100%"
				position="relative"
			>
				{/* Overlay preto */}
				{hovered ? null : (
					<Box
						position="absolute"
						top="0"
						left="0"
						right="0"
						bottom="0"
						zIndex="1"
						bg={
							(props.option === "option1" && !isBreakfastTime) ||
							(props.option === "option2" && !isAlunchTime) ||
							(props.option === "option3" && !isAfternoonTeaTime)
								? "rgba(0, 0, 0, 0.8)"
								: "rgba(0, 0, 0, 0.1)"
						}
						borderRadius="0.55rem"
					/>
				)}
	
				{(props.option === "option1" && !isBreakfastTime) ||
					(props.option === "option2" && !isAlunchTime) ||
					(props.option === "option3" && !isAfternoonTeaTime)
						? (
					<Box
						as="span"
						display="flex"
						justifyContent="center"
						alignItems="center"
						position="relative"
						zIndex="2"
						minHeight="100%"
						textAlign="center"
						alignContent="center"
						minWidth="100%"
						textShadow="1rem 1rem 1rem black"
					>
						<TbClockOff color="#fff" size="50%" />
					</Box>
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
		</GridItem>
	);
}
