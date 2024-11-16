import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useDisclosure, Divider, Box, Heading, Image, Flex, Spacer, useToast, Spinner } from '@chakra-ui/react';
import { RiEdit2Fill } from 'react-icons/ri';
import { useRef, useState } from "react";
import axios from 'axios';

export const EditProfilePic = ({ m, w, title, setMyPic, myPic, user }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const profile = useRef();
    const [preview, setPreview] = useState(myPic);
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
            setFile(file);
        }
    };

    const handleClose = () => {
        setPreview(myPic);
        onClose();
    };

    const handleUpdateAvt = async () => {
        if (file === null) {
            toast({
                title: "No files selected",
                description: "Please choose the photo you want to use as your avatar.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            });
            return;
        }

        setIsLoading(true); 

        try {
            const formData = new FormData();
            formData.append("imageFile", file);

            const uploadAvtResponse = await axios.post(`${process.env.REACT_APP_API_URL}/post/uploadImage`, formData);
            const updateResponse = await axios.put(`${process.env.REACT_APP_API_URL}/user/upload?userId=${user.id}`, {
                "imageUrl": uploadAvtResponse.data.imageUrl
            });

            setFile(null);
            setMyPic(uploadAvtResponse.data.imageUrl);
            setPreview(uploadAvtResponse.data.imageUrl);

            toast({
                title: updateResponse.data,
                description: "Your avatar has been successfully updated.",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top"
            });
        } catch (error) {
            console.error("Error uploading avatar:", error);
            toast({
                title: "Error updating avatar.",
                description: "There was an error updating your avatar. Please try again.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            });
        } finally {
            setIsLoading(false); 
            onClose();
        }
    };

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
                            <div>
                                <Flex>
                                    <Heading fontSize={20}>Profile Pic</Heading>
                                    <Spacer />
                                    <input ref={profile} type='file' accept="image/png, image/jpeg" name='mypic' onChange={handleFileChange} disabled={isLoading} />
                                    <Spacer />
                                    <Button 
                                        type='button' 
                                        onClick={handleUpdateAvt} 
                                        isLoading={isLoading} 
                                        loadingText="Updating" 
                                        disabled={isLoading}
                                    >
                                        Update
                                    </Button>
                                </Flex>
                            </div>
                            <Flex justify={'center'} m={4}>
                                <Box w={'160px'} 
                                    h={'160px'} 
                                    overflow={'hidden'} 
                                    rounded={'full'}
                                    display="flex" 
                                    alignItems="center" 
                                    justifyContent="center"
                                >
                                    {isLoading ? (
                                        <Spinner size="xl" />
                                    ) : (
                                        <Image src={preview !== "" ? preview : "https://archive.org/download/placeholder-image/placeholder-image.jpg"} 
                                            objectFit="cover" 
                                            w="100%" 
                                            h="100%"
                                        />
                                    )}
                                </Box>
                            </Flex>
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        {
                            !isLoading && (
                                <Button colorScheme='blue' mr={3} onClick={onClose}>
                                    Close
                                </Button>
                            ) 
                        }
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
