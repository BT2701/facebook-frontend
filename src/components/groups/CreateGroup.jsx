import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, useDisclosure, Input, VStack, } from '@chakra-ui/react'
import { useState } from 'react';

export const CreateGroup = ({ postData }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();


    return (
        <>
            <Button colorScheme={'blue'} onClick={onOpen}>Create Group</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Group</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack gap={2} mb={6}>
                            <Input name='src' placeholder='Paste Group pic image url (optional)' />
                            <Input  name='title' placeholder='Group Name' />
                            <Button  w={'100%'} > Create </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};



