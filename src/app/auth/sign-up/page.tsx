"use client";
import { AuthRegisterProps } from "@/_interfaces/auth-props";
import axios from "axios";
import React from "react";

const SignUpPage = () => {
  const [formData, setFormData] = React.useState<AuthRegisterProps>({
    email: "",
    password: "",
    confirmPassword: "",
    name: null,
    avatar: null,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // formData is used to send both data and file
    const form = new FormData();

    // append data to form
    form.append("email", formData.email);
    form.append("password", formData.password);
    if (formData.name) form.append("name", formData.name);
    if (formData.avatar) form.append("avatar", formData.avatar);

    // send data to server
    try {
      const response = await axios.post("/api/sign-up", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
    } catch (e) {
      console.log(e);
    }
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
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="file"
          onChange={(e) =>
            setFormData({ ...formData, avatar: e.target.files?.[0] })
          }
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpPage;
