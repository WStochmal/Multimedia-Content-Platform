"use client";
import { useSignin } from "@/_hooks/useSignIn";
import { AuthLoginProps } from "@/_interfaces/auth-props";
import axios from "axios";
import { sign } from "crypto";
import React, { useState } from "react";

const SignInPage = () => {
  const [formData, setFormData] = useState<AuthLoginProps>({
    email: "",
    password: "",
  });

  const { signIn, isLoading, error } = useSignin();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signIn(formData);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignInPage;
