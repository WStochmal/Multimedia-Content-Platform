"use client";
import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "./useAuthContext";

export const useList = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { state } = useAuthContext();

  /**
   * Funkcja dodająca zdjęcie do określonej listy
   * @param {string} listName - Nazwa listy
   * @param {number} mediaId - ID zdjęcia
   */
  const addToList = async (listName: string, mediaId: number) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        "/api/list/add",
        { listName, mediaId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.token}`,
          },
        }
      );

      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.log(error);
      setError(
        error.response?.data?.message?.toString() || "An error occurred"
      );
      setIsLoading(false);
    }
  };

  const removeFromList = async (listName: string, mediaId: number) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        "/api/list/remove",
        { listName, mediaId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.token}`,
          },
        }
      );

      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.log(error);
      setError(
        error.response?.data?.message?.toString() || "An error occurred"
      );
      setIsLoading(false);
    }
  };

  return { addToList, removeFromList };
};
