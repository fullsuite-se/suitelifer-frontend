import api from "./axios";

const sendVerification = async (userId, email) => {
  const response = await api.post("/api/send-account-verification-link", {
    userId: userId,
    email: email,
  });
  return response.data;
};

export default sendVerification;
