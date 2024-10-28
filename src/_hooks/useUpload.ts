"use client";
import { UploadProps } from "@/_interfaces/upload-media-props";
import axios from "axios";
import React, { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useUpload = () => {
  const { state } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (formData: UploadProps) => {
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    formData.tags.forEach((tag) => form.append("tags[]", tag));

    if (formData.file) form.append("file", formData.file);

    try {
      setIsLoading(true);
      const response = await axios.post("/api/upload-media", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${state.token}`,
        },
      });

      console.log(response.data);

      setIsLoading(false);
    } catch (error) {
      setError(
        error.response?.data?.message?.toString() || "An error occurred"
      );
      setIsLoading(false);
    }
  };
  return { isLoading, error, upload };
};
