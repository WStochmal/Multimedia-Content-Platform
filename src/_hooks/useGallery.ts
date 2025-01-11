"use client";
import axios from "axios";
import React, { useState } from "react";
import { useAuthContext } from "./useAuthContext";
export const useGallery = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { state } = useAuthContext();

  const fetchGallery = async ({
    type,
    page = 1,
    limit = 15,
    imageType,
    searchValue = "",
  }: {
    type: "recommended" | "default";
    page?: number;
    limit?: number;
    imageType: "favourite" | "default" | "mine";
    searchValue?: string;
  }) => {
    setIsLoading(true);
    try {
      const config = {
        headers: state.token
          ? {
              Authorization: `Bearer ${state.token}`,
            }
          : {},
        params: {
          type,
          limit,
          page,
          imageType,
          searchValue,
        },
      };

      const response = await axios.get("/api/gallery", config);

      // console.log(response.data);
      return response.data;
    } catch (error) {
      setError(error);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchGallery, isLoading, error };
};
