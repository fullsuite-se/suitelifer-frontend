import api from "./axios";

const sendVerification = async (userId, email) => {
  const response = await api.post("/api/send-verification-code", {
    userId: userId,
    email: email,
  });
  return response.data;
};

export default sendVerification;
