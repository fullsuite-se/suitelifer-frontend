import React, { useState } from "react";
import OnLoadLayoutAnimation from "../../components/layout/OnLoadLayoutAnimation";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../utils/axios";
import { useEffect } from "react";
import toast from "react-hot-toast";

const VerifyAccount = () => {
  const [params] = useSearchParams();
  const payloadEncrypted = params.get("payload-encrypted");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyCode = async () => {
      try {
        const response = await api.get(
          "/api/verify-account-verification-link",
          {
            params: { payloadEncrypted },
          }
        );

        if (response.data.isSuccess) {
          toast.success(response.data.message);
          navigate("/login");
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
      }
    };
    verifyCode();
  }, []);

  return (
    <section className="w-dvw h-dvh">
      <OnLoadLayoutAnimation />
    </section>
  );
};

export default VerifyAccount;
