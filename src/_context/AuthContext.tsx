"use client";
import {
  AuthActionProps,
  AuthContextProps,
  AuthProps,
} from "@/_interfaces/auth-props";
import { useReducer, createContext, useEffect } from "react";

// Definition of AuthState type, based on AuthProps
type AuthState = AuthProps;

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

const authReducer = (state: AuthState, action: AuthActionProps): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        token: action.payload?.token || null,
        user: action.payload?.user || null,
        isInitialized: true,
      };
    case "LOGOUT":
      localStorage.removeItem("user");
      return {
        token: null,
        user: null,
        isInitialized: true,
      };
    default:
      return state;
  }
};

const validateTokenDate = (token: string) => {
  const tokenPayload = token.split(".")[1];
  const decodedTokenPayload = atob(tokenPayload);

  const decodedTokenPayloadObject = JSON.parse(decodedTokenPayload);
  return decodedTokenPayloadObject.exp * 1000 > Date.now();
};

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const initialState: AuthState = {
    token: null,
    user: null,
    isInitialized: false,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  const authContextValue = {
    state,
    dispatch,
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    const parsedUser = JSON.parse(user);
    if (user) {
      if (validateTokenDate(parsedUser.token)) {
        dispatch({ type: "LOGIN", payload: JSON.parse(user) });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    } else {
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
