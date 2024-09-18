import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useDisclosure, Divider, Box, Heading, Image, Flex, Spacer } from '@chakra-ui/react'
import { RiEdit2Fill } from 'react-icons/ri';
import { loadData } from '../../utils/localstore';
import { useEffect, useRef } from "react"
import { Heroku } from '../../utils/herokuLink';



export const EditProfilePic = ({ m, w, title, pic, setPic, mycpic, setMycpic }) => {

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

                        <Box m={'10px'}>
                            <form>
                                <Flex>
                                    <Heading fontSize={20}>Profile Pic</Heading>
                                    <Spacer />
                                    <input ref={"profile"} type='file' accept="image/png, image/jpeg" name='mypic' />
                                    <Spacer />
                                    <Button type='submit' >Add</Button>
                                </Flex>
                            </form>
                            <Flex justify={'center'} m={4}>
                                <Box w={'160px'} h={'160px'} overflow={'hidden'} rounded={'full'}>
                                    <Image src={`uploadImgs/${pic}`} />
                                </Box>
                            </Flex>
                        </Box>
                        <Divider />
                        <Box m={'20px'}>
                        <form >
                            <Flex>
                                <Heading fontSize={20}>Cover Photo</Heading>
                                <Spacer />
                                <input id='profilePic' ref={"coverpic"} type='file' accept="image/png, image/jpeg" name="mycpic" />
                                <Spacer />
                                <Button type='submit'>Add</Button>
                            </Flex>

                            </form>


                            <Flex justify={'center'} m={4}>
                                <Box w={'330px'} h={'100px'} overflow={'hidden'} rounded={4}>
                                    <Image w={'100%'} src={`uploadImgs/${mycpic}`} />
                                </Box>
                            </Flex>
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

