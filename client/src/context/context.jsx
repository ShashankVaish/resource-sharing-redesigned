import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on app load
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('loggenduser');
    
    if (token && username) {
      setUser({ username, token });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('token', userData.jwttoken);
    localStorage.setItem('loggenduser', userData.isloggendUser);
    setUser({ 
      username: userData.isloggendUser, 
      token: userData.jwttoken 
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggenduser');
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Legacy context for backward compatibility
export const id_userContext = createContext(""); 