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
  const [captchaCode, setCaptchaCode] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [randomCode, setRandomCode] = useState("");
  const [userEnteredCode, setUserEnteredCode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forgetEmail, setForgetEmail] = useState("");
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
    setCaptchaCode(""); // Reset mã captcha khi ReCAPTCHA được tải lại

    // Tạo mã 6 ký tự ngẫu nhiên
    const code = Math.random().toString(36).substring(2, 8);
    setRandomCode(code); // Lưu mã ngẫu nhiên
  };

  const handleUserEnteredCodeChange = (e) => {
    setUserEnteredCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      loginAttempts >= 5 &&
      (!captcha ||
        userEnteredCode.trim() === "" ||
        userEnteredCode !== randomCode)
    ) {
      // Kiểm tra xem người dùng đã nhập mã ngẫu nhiên đúng chưa
      toast({
        title: "Vui lòng xác nhận bạn không phải là robot và nhập mã xác thực.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/login`,
        { email, password, captcha: captchaCode },
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
        console.log("Session userId:", userId);
        setCurrentUser(parseInt(userId));

        toast({
          title: "Đăng nhập thành công!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/");
      }
    } catch (error) {
      setLoginAttempts((prevAttempts) => prevAttempts + 1);

      if (error.response) {
        if (
          error.response.status === 400 &&
          error.response.data.message === "Email not verified."
        ) {
          toast({
            title: "Đăng nhập không thành công!",
            description:
              "Chưa xác thực email. Vui lòng kiểm tra email để xác thực tài khoản của bạn.",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Đăng nhập không thành công!",
            description: "Tài khoản hoặc mật khẩu không đúng!",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "Đăng nhập không thành công!",
          description: "Có lỗi xảy ra, vui lòng thử lại sau.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  // Hàm xử lý khi nhấn phím Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  // Hàm mở modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Hàm xử lý quên mật khẩu
  const handleForgetPassword = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/forgetpassword`,
        { Email: forgetEmail }, // Thay đổi để khớp với yêu cầu của API
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast({
          title: "Email đã được gửi!",
          description: "Vui lòng kiểm tra email của bạn để biết hướng dẫn.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        closeModal(); // Đóng modal khi thành công
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.response?.data || "Có lỗi xảy ra.",
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
            Facebook giúp bạn kết nối và chia sẻ với mọi người trong cuộc sống
            của bạn.
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
                  name="email"
                  placeholder="Địa chỉ email"
                  h={"50px"}
                  mb={4} // Thêm margin bottom cho khoảng cách
                  onChange={handleChangeEmail}
                  onKeyDown={handleKeyDown} // Xử lý phím Enter
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="Mật khẩu"
                  h={"50px"}
                  mb={4} // Thêm margin bottom cho khoảng cách
                  onChange={handleChangePassword}
                  onKeyDown={handleKeyDown} // Xử lý phím Enter
                />
                {loginAttempts >= 5 && (
                  <>
                    <ReCAPTCHA
                      sitekey="6LdAwXQqAAAAAK2fIAzIWCiaPsev2dm8_KBr6aOp"
                      onChange={handleCaptchaChange}
                    />
                    <Text fontSize="lg" mt={2}>
                      Mã xác thực:{" "}
                      <span style={{ textDecoration: "line-through" }}>
                        {randomCode}
                      </span>
                    </Text>
                    <Input
                      type="text"
                      placeholder="Nhập mã xác thực"
                      value={userEnteredCode}
                      onChange={handleUserEnteredCodeChange}
                      mb={4} // Thêm margin bottom cho khoảng cách
                    />
                  </>
                )}
                <Button
                  type="submit"
                  w={"100%"}
                  bg={"#1877f2"}
                  color={"white"}
                  fontWeight={500}
                  size="lg"
                  _hover={{ bg: "#2572d6" }}
                  fontSize={20}
                >
                  Đăng Nhập
                </Button>
              </form>
              <Divider />
              <Text color="#1877f2" cursor="pointer" onClick={openModal} mt={4}>
                Quên tài khoản?
              </Text>
              <Flex justify={"center"} mt={6}>
                <Signup />
              </Flex>
            </VStack>
          </Container>
        </Box>
      </Grid>

      {/* Modal cho tính năng quên mật khẩu */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Quên mật khẩu</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>Nhập địa chỉ email của bạn:</Text>
            <Input
              type="email"
              placeholder="Email"
              value={forgetEmail}
              onChange={(e) => setForgetEmail(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleForgetPassword}>
              Gửi email
            </Button>
            <Button variant="ghost" onClick={closeModal}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
