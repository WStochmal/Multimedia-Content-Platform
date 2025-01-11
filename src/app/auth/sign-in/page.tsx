"use client";
import { useSignin } from "@/_hooks/useSignIn";
import { AuthLoginProps } from "@/_interfaces/auth-props";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import AuthStyle from "@/_styles/modules/Auth.module.css";
import { Input } from "@/_ui/input/Input";

const SignInPage = () => {
  const router = useRouter();
  const { signIn, isLoading, error } = useSignin();
  const [formData, setFormData] = useState<AuthLoginProps>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (await signIn(formData)) router.push("/");
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className={AuthStyle.formContainer}>
        <h2>Sign In</h2>
        <span>
          <Input
            type="email"
            placeholder="Email"
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
            }}
            icon="search"
            required
          />
        </span>
        <span>
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
            }}
            icon="search"
            required
          />
        </span>

        <button className="commonBtn" type="submit">
          Sign In
        </button>
        <p style={{ color: "grey", fontSize: "0.8rem" }}>
          Don't have a account?
        </p>
        <button
          className="commonBtn"
          onClick={() => {
            router.push("/auth/sign-up");
          }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignInPage;
