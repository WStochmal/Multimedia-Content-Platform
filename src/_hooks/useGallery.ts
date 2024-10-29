"use client";
import axios from "axios";
import React, { useState } from "react";
export const useGallery = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGallery = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/gallery");
      setIsLoading(false);
      console.log(response.data);
      return response.data;
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

  return { fetchGallery, isLoading, error };
};
