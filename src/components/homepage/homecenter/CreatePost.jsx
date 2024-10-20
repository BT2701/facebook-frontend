import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Divider,
    Textarea,
    VStack,
    HStack,
    Text,
    useToast,
    Input,
} from '@chakra-ui/react';
import { useState } from 'react';
import axios from "axios";

export const CreatePost = ({ getpost }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [postContent, setPostContent] = useState('');
    const [image, setImage] = useState(null);
    const toast = useToast();

    const handlePostSubmit = async () => {
        // Check if post content is empty
        if (!postContent.trim()) {
            toast({
                title: 'Error',
                description: 'Post content cannot be empty',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        if (image) {
            console.log(image);
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result.split(',')[1]; // Remove the prefix
                try {
                    const data = {
                        content: postContent,
                        image: base64String,
                        userId: 1,
                    };
                    const response = await axios.post('/api/post', {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.ok) {
                        toast({
                            title: 'Post created.',
                            description: 'Your post has been successfully created.',
                            status: 'success',
                            duration: 3000,
                            isClosable: true,
                        });
                        onClose();
                        setPostContent('');
                        setImage(null);
                        // getpost();
                    } else {
                        throw new Error('Failed to create post');
                    }
                } catch (error) {
                    toast({
                        title: 'Error',
                        description: 'There was an error creating your post. Please try again.',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                }
            };

            reader.readAsDataURL(image); // Read the image as Data URL (Base64)
        } else {
            toast({
                title: 'Error',
                description: 'Post image cannot be empty',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            setImage(file); // Set selected image
        } else {
            alert('Please select a valid image file (PNG or JPEG)');
        }
    };

    return (
        <>
            <Button w={'80%'} rounded={'full'} mt={1} py={'20px'} onClick={onOpen}>
                What's on your mind?
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size={'lg'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />
                    <Divider />
                    <ModalBody>
                        <VStack gap={3} mb={'20px'}>
                            <Textarea
                                minH={'200px'}
                                fontSize={23}
                                placeholder="What's on your mind?"
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                            />
                            <HStack>
                                <Text fontSize={20} fontWeight={500}>
                                    Add Image:
                                </Text>
                                <input
                                    type={'file'}
                                    accept="image/png, image/jpeg"
                                    onChange={handleFileChange}
                                />
                            </HStack>
                            {image && (
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Selected"
                                    style={{ width: '300px', marginTop: '10px' }}
                                />
                            )}
                            <Button
                                colorScheme={'blue'}
                                w={'100%'}
                                onClick={handlePostSubmit}
                            >
                                Post
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
