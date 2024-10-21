// Definition: Interfaces for Auth Login
export interface AuthLoginProps {
  email: string;
  password: string;
}

// Definition: Interfaces for Auth Props
export interface AuthProps {
  token: string | null;
  user: {
    id: number;
    name: string;
    email: string;
  } | null;
}

// Definition: Interfaces for Auth Action Props
export interface AuthActionProps {
  type: "LOGIN" | "LOGOUT";
  payload?: {
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
}

// Definition: Interfaces for Auth Context
export interface AuthContextProps {
  state: AuthProps;
  dispatch: React.Dispatch<AuthActionProps>;
}
