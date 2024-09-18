import { Box, Button, Container, Divider, Flex, Grid, Heading, Input, Text, useToast, VStack } from '@chakra-ui/react';
import { useState } from "react"
import { Signup } from './Signup';


export const Login = () => {

    const [form, setForm] = useState({ email: "", password: "" });

    
    const handleChange = ({ target: { name, value } }) => setForm({ ...form, [name]: value });





    return (

        <>
            <Box bg={'#f0f2f5'} h={'700px'}>
                <Grid templateColumns='repeat(2, 1fr)' maxW={'1100px'} m={'auto'} h={'600px'} >

                    <Box mt={'160px'} py={5} ps={8} pe={2}>
                        <Heading color={'#1877f2'} fontSize={60} mb={4}>facebook</Heading>
                        <Text lineHeight={1.2} fontWeight={500} fontSize={26}>Facebook helps you connect and share with the people in your life.</Text>
                    </Box>

                    <Box >
                        <Container h={'350px'} maxW={'400px'} mt={'120px'} bg={'white'} boxShadow={'lg'} rounded={10} p={4}>
                            <form >
                                <VStack gap={2}>
                                    <Input type='email' name='email' placeholder='Email address' h={'50px'} onChange={handleChange} />
                                    <Input type='password' name='password' placeholder='Password' h={'50px'} onChange={handleChange} />
                                    <Button type='submit' w={'100%'} bg={'#1877f2'} color={'white'} fontWeight={500} size='lg' _hover={{ bg: '#2572d6' }} fontSize={20}>Log In</Button>
                                    <Text>Forgotten password?</Text>
                                    <Divider />
                                </VStack>
                            </form>
                            <Flex justify={'center'} mt={6}>
                            <Signup />
                            </Flex>
                        </Container>
                    </Box>

                </Grid>
            </Box>
        </>
    );
};