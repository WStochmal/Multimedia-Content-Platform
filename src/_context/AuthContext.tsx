"use client";
import {
  AuthActionProps,
  AuthContextProps,
  AuthProps,
} from "@/_interfaces/auth-props";
import { useReducer, createContext } from "react";

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
      };
    case "LOGOUT":
      return {
        token: null,
        user: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const initialState: AuthState = {
    token: null,
    user: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  const authContextValue = {
    state,
    dispatch,
  };

  console.log(state);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
