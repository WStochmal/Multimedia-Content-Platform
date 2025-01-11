"use client";
import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { AuthLoginProps } from "@/_interfaces/auth-props";
import axios from "axios";

export const useSignin = () => {
  const { dispatch } = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signIn = async ({ email, password }: AuthLoginProps) => {
    setError(null);
    setIsLoading(true);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await axios.post("/api/sign-in", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      localStorage.setItem("user", JSON.stringify(response.data));
      setIsLoading(false);
      dispatch({ type: "LOGIN", payload: response.data });
      return true;
    } catch (error) {
      console.log(error);
      return false;
      setError(
        error.response?.data?.message?.toString() || "An error occurred"
      );
    }
  };

  return { error, isLoading, signIn };
};
