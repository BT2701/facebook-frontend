import { Search2Icon } from "@chakra-ui/icons";
import { Avatar, Center, Container, Flex, Image, Input, InputGroup, InputLeftElement, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heroku } from "../../utils/herokuLink";
import { saveData } from "../../utils/localstore";

export const Search = () => {

    const [isOpen, setIsOpen] = useState(false);
    

    return (
        <>
            <Center mx={4}>
                <Image boxSize='40px' borderRadius='full' alt="fb Logo" src="https://tinyurl.com/46yb9h2c" />
            </Center>
            <Center>
                <InputGroup>
                    <InputLeftElement pointerEvents='none' children={<Search2Icon color='gray.300' />} />
                    <Input  id='searchbox' value={"text"} rounded={'full'} placeholder="Search Facebook" bg={'#f0f2f5'} w={'270px'} />
                </InputGroup>
            </Center>
            <Container id='style-3' display={isOpen ? 'block' : 'none'} w={'350px'} minH={'300px'} maxH={'300px'} top={'50px'} pos="fixed" p={5} rounded={8} bg={'white'} boxShadow={'xl'} overflow={'auto'}>
                
                    <Flex p={2} my={1}  key={"_id"} cursor={'pointer'} _hover={{ bg: '#ebebeb' }}>
                        <Avatar size={'sm'} />
                        <Text ml={4} fontSize={17}>{"firstName"} {"lastName"}</Text>
                    </Flex>
                
            </Container>
        </>
    );
};