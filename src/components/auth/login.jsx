import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  Input,
  Text,
  useToast,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useState } from "react";
import { Signup } from "./Signup";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forgetEmail, setForgetEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const { setCurrentUser } = useUser();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleCaptchaChange = (value) => {
    setCaptcha(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the user has made too many login attempts
    if (loginAttempts >= 5 && !captcha) {
      toast({
        title: "Please confirm you are not a robot.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const sessionResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/sessionInfo`,
          { withCredentials: true }
        );

        const userId = sessionResponse.data.userId;
        setCurrentUser(parseInt(userId));

        toast({
          title: "Login successful!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/");
      }
    } catch (error) {
      setLoginAttempts((prevAttempts) => prevAttempts + 1);
      console.log("Error toJSON:", error.toJSON());
      if (
        error.response?.status === 400 &&
        error.response.data === "Email not verified."
      ) {
        toast({
          title: "Login failed!",
          description: "Email not verified. Please check your email.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Login failed!",
          description: "Incorrect email or password!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleForgetPassword = async () => {
    if (!forgetEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!birthDate) {
      toast({
        title: "Error",
        description: "Please select your date of birth.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/forgetpassword`,
        { Email: forgetEmail, BirthDate: birthDate },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast({
          title: "Email sent!",
          description: "Please check your email for further instructions.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        closeModal();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data || "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg={"#f0f2f5"} h={"700px"}>
      <Grid
        templateColumns="repeat(2, 1fr)"
        maxW={"1100px"}
        m={"auto"}
        h={"600px"}
      >
        <Box mt={"160px"} py={5} ps={8} pe={2}>
          <Heading color={"#1877f2"} fontSize={60} mb={4}>
            facebook
          </Heading>
          <Text lineHeight={1.2} fontWeight={500} fontSize={26}>
            Facebook helps you connect and share with the people in your life.
          </Text>
        </Box>

        <Box>
          <Container
            h={"500px"}
            maxW={"400px"}
            mt={"120px"}
            bg={"white"}
            boxShadow={"lg"}
            rounded={10}
            p={4}
          >
            <VStack gap={2}>
              <form onSubmit={handleSubmit}>
                <Input
                  type="email"
                  placeholder="Email address"
                  h={"50px"}
                  mb={4}
                  onChange={handleChangeEmail}
                  onKeyDown={handleKeyDown}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  h={"50px"}
                  mb={4}
                  onChange={handleChangePassword}
                  onKeyDown={handleKeyDown}
                />
                {loginAttempts >= 5 && (
                  <ReCAPTCHA
                    sitekey="6LdAwXQqAAAAAK2fIAzIWCiaPsev2dm8_KBr6aOp"
                    hl="en"
                    onChange={handleCaptchaChange}
                  />
                )}
                <Button
                  type="submit"
                  w={"100%"}
                  bg={"#1877f2"}
                  color={"white"}
                  fontWeight={500}
                  size="lg"
                >
                  Log In
                </Button>
              </form>
              <Divider />
              <Text color="#1877f2" cursor="pointer" onClick={openModal} mt={4}>
                Forgot account?
              </Text>
              <Flex justify={"center"} mt={6}>
                <Signup />
              </Flex>
            </VStack>
          </Container>
        </Box>
      </Grid>

      {/* Modal for Forgot Password */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Forgot Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>Enter your email address:</Text>
            <Input
              type="email"
              placeholder="Email"
              value={forgetEmail}
              onChange={(e) => setForgetEmail(e.target.value)}
              mb={4}
            />

            <Text mb={2}>Enter your date of birth:</Text>
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleForgetPassword}>
              Send Email
            </Button>
            <Button variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
