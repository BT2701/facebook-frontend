import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useDisclosure, Divider, Box, Heading, Image, Flex, Spacer } from '@chakra-ui/react';
import { RiEdit2Fill } from 'react-icons/ri';
import { useRef, useState } from "react";

export const EditProfilePic = ({ m, w, title, pic, setPic, mycpic, setMycpic }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const profile = useRef();
    const [preview, setPreview] = useState(`uploadImgs/${pic}`);

    // Function to handle file selection and create preview URL
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
        }
    };

    const handleClose = () => {
        setPreview("");
        onClose()
    }

    return (
        <>
            <Button leftIcon={<RiEdit2Fill />} m={m} w={w} onClick={onOpen}>{title}</Button>

            <Modal isOpen={isOpen} onClose={handleClose} size={'2xl'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontWeight={700} textAlign={'center'}>Edit Avatar</ModalHeader>
                    <Divider />
                    <ModalCloseButton />
                    <ModalBody>
                        <Box m={'10px'}>
                            <form>
                                <Flex>
                                    <Heading fontSize={20}>Profile Pic</Heading>
                                    <Spacer />
                                    <input ref={profile} type='file' accept="image/png, image/jpeg" name='mypic' onChange={handleFileChange} />
                                    <Spacer />
                                    <Button type='submit'>Add</Button>
                                </Flex>
                            </form>
                            <Flex justify={'center'} m={4}>
                                <Box w={'160px'} 
                                    h={'160px'} 
                                    overflow={'hidden'} 
                                    rounded={'full'}
                                    display="flex" 
                                    alignItems="center" 
                                    justifyContent="center"
                                >
                                    <Image src={preview} 
                                        objectFit="cover" 
                                        w="100%" 
                                        h="100%"
                                    />
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
