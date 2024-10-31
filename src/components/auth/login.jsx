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
} from "@chakra-ui/react";
import { useState } from "react";
import { Signup } from "./Signup";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setCurrentUser } = useUser();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        // Lấy userId từ session
        const sessionResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/sessionInfo`,
          { withCredentials: true }
        );

        // Lấy userId từ session và log ra console coi chơi
        const userId = sessionResponse.data.userId;
        console.log("Session userId:", userId);

        // Lưu userId vào context
        setCurrentUser(parseInt(userId)); // Lưu userId vào context

        toast({
          title: "Login successful!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/"); // Điều hướng về trang chính
      }
    } catch (error) {
      toast({
        title: "Login failed!",
        description: error.message || "Something went wrong.",
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
            h={"350px"}
            maxW={"400px"}
            mt={"120px"}
            bg={"white"}
            boxShadow={"lg"}
            rounded={10}
            p={4}
          >
            <VStack gap={2}>
              <Input
                type="email"
                name="email"
                placeholder="Email address"
                h={"50px"}
                onChange={handleChangeEmail}
              />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                h={"50px"}
                onChange={handleChangePassword}
              />
              <Button
                type="submit"
                w={"100%"}
                bg={"#1877f2"}
                color={"white"}
                fontWeight={500}
                size="lg"
                _hover={{ bg: "#2572d6" }}
                fontSize={20}
                onClick={handleSubmit}
              >
                Log In
              </Button>
              {/* <Link to="/">
                <Text color="blue.500" _hover={{ textDecoration: "underline" }}>
                  Forgotten password?
                </Text>
              </Link> */}
              <Divider />
            </VStack>
            <Flex justify={"center"} mt={6}>
              <Signup />
            </Flex>
          </Container>
        </Box>
      </Grid>
    </Box>
  );
};
