import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from Cookies 
  useEffect(() => {
    const storedUser =JSON.parse(localStorage.getItem("user"))
    if (storedUser) setUser(storedUser);
  }, []);

  // LOGIN
  const login = (userData) => {
    setUser(userData);
    Cookies.set("token", userData.token, { expires: 10 });
   localStorage.setItem("user", JSON.stringify(userData.user));
  };

  // SIGNUP
  const signup = (userData) => {
    setUser(userData);
    Cookies.set("token", userData.token, { expires: 10 });
    localStorage.setItem("user", JSON.stringify(userData.user));
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    Cookies.remove("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);