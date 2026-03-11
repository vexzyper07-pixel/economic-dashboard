import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";

const USER_KEY = "economic_user";
const TOKEN_KEY = "economic_token";

const AuthContext = createContext(null);

const readStoredJson = (key) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readStoredJson(USER_KEY));
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const login = useCallback(({ user: nextUser, token: nextToken }) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    localStorage.setItem(TOKEN_KEY, nextToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      logout
    }),
    [login, logout, token, user]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
