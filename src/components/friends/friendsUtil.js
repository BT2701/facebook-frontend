import axios from "axios";

// Hàm xóa yêu cầu theo ID
export const deleteRequestById = async (id) => {
    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/Request/${id}`); // Gọi API DELETE

        if (response.status === 204) { // Nếu thành công
            return true; // Trả về true để xác nhận xóa thành công
        }
    } catch (error) {
        console.error('Error deleting request:', error);
        return false; // Trả về false nếu có lỗi
    }
};

// Hàm thêm yêu cầu
export const addRequest = async (sender, receiver) => {
    alert("sender"+sender+"receiver"+receiver);
    try {
        const requestBody = {
            sender,       // Giá trị sender
            receiver,     // Giá trị receiver
            time: new Date().toISOString() // Sửa trường Timeline thành time
        };

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/Request`, requestBody); // Gọi API POST

        if (response.status === 200) { // Nếu thành công, thường thì 201 là cho tạo mới
            return true; // Trả về dữ liệu của yêu cầu mới tạo
        }
    } catch (error) {
        console.error('Error adding request:', error);
        return false; // Trả về null nếu có lỗi
    }
};
