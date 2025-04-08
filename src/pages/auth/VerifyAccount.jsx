import React, { useState } from "react";
import OnLoadLayoutAnimation from "../../components/layout/OnLoadLayoutAnimation";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../utils/axios";
import { useEffect } from "react";
import toast from "react-hot-toast";

const VerifyAccount = () => {
  const [params] = useSearchParams();
  const code = params.get("code");
  const id = params.get("id");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyCode = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/verify-verification-code", {
          params: { code, id },
        });

        if (response.data.isSuccess) {
          toast.success(response.data.message);
          navigate("/app/blogs-feed");
        }
      } catch (error) {
        if (error.status === 400) {
          toast.error(
            error.response.data.message ||
              "Your password verification link has expired. Please request a new one."
          );
        } else {
          toast.error(error.response.data.message || "Invalid request");
        }
      } finally {
        setLoading(false);
      }
    };
    verifyCode();
  }, []);

  return (
    <section className="w-dvw h-dvh">
      <div>{code}</div>
      <div>{id}</div>
      <OnLoadLayoutAnimation />
    </section>
  );
};

export default VerifyAccount;
