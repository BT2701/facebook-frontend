import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useDisclosure, Input, Divider, Box, Heading, Flex, VStack, useToast, } from '@chakra-ui/react'
import { RiEdit2Fill } from 'react-icons/ri';
import { loadData } from '../../utils/localstore';
import { useState } from "react"
import { Heroku } from '../../utils/herokuLink';


export const EditProfile = ({ m, w, title, getUserData }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    
    return (
        <>
            <Button leftIcon={<RiEdit2Fill />} m={m} w={w} onClick={onOpen}>{title}</Button>

            <Modal isOpen={isOpen} onClose={onClose} size={'2xl'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontWeight={700} textAlign={'center'}>Edit Profile</ModalHeader>
                    <Divider />
                    <ModalCloseButton />
                    <ModalBody >

                        <Box m={'20px'}>
                            <Heading fontSize={20}>Bio</Heading>
                            <Flex my={2} gap={2}>
                                <Input  type={'text'} placeholder='Add your Bio' />
                                <Button  >Add</Button>
                            </Flex>
                        </Box>

                        <Divider />

                        <Box m={'20px'}>
                            <Heading fontSize={20}>Customise your Intro</Heading>
                            <VStack mt={3}>
                                <Input name='currentCity' type={'text'} placeholder='Current town or city' />
                                <Input  name='workplace' type={'text'} placeholder='Workplace' />
                                <Input  name='university' type={'text'} placeholder='University' />
                                <Input  name='school' type={'text'} placeholder='School' />
                                <Input  name='homeTown' type={'text'} placeholder='Home town' />
                                <Input  name='relationship' type={'text'} placeholder='Relationship status' />
                                <Button  type={'submit'} w={'100%'}>Add</Button>
                            </VStack>
                        </Box>

                        <Divider />

                        <Box m={'20px'}>
                            <Heading fontSize={20}>Hobbies and Interests</Heading>
                            <VStack mt={3}>
                                <Input  name='hobbies' type={'text'} placeholder='Hobbies' />
                                <Input  name='interest' type={'text'} placeholder='Interests' />
                                <Input  name='language' type={'text'} placeholder='Languages' />
                                <Button type={'submit'} w={'100%'}>Add</Button>
                            </VStack>
                        </Box>

                        <Divider />

                        <Box m={'20px'}>
                            <Heading fontSize={20}>Social media Links</Heading>
                            <VStack mt={3}>
                                <Input  name='website' type={'text'} placeholder='Website' />
                                <Input  name='socialLink' type={'text'} placeholder='Social Link' />
                                <Button  type={'submit'} w={'100%'}>Add</Button>
                            </VStack>
                        </Box>

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>

    );
};

