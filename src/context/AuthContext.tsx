import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ContextType, User } from "@/types";
import { getCurrentUser } from "@/api/userAPI";

export const INITIAL_USER: User & {
  followings: string[];
} = {
  id: "",
  name: "",
  bio: "",
  username: "",
  email: "",
  imageUrl: "",
  followings: [],
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

const AuthContext = createContext<ContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const checkAuthUser = async () => {
    const currentAccount = await getCurrentUser();

    setUser({
      id: currentAccount.$id,
      name: currentAccount.name,
      bio: currentAccount.bio,
      username: currentAccount.username,
      email: currentAccount.email,
      imageUrl: currentAccount.imageUrl,
      followings: currentAccount.followings,
    });

    setIsAuthenticated(true);

    return true;
  };

  useEffect(() => {
    if (
      localStorage.getItem("cookieFallback") === "[]" ||
      localStorage.getItem("cookieFallback") === null
    ) {
      navigate("/sign-in");
    }
    checkAuthUser();
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
