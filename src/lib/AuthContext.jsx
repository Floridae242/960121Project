import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { DEMO_USER } from "@/lib/app-params";

const AUTH_STORAGE_KEY = "panglaong-user";
const AuthContext = createContext(null);

function readUserFromStorage() {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readUserFromStorage());
  const [authError, setAuthError] = useState(null);

  const saveUser = useCallback((nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const login = useCallback(
    ({ email, password }) => {
      if (email === DEMO_USER.email && password === DEMO_USER.password) {
        const nextUser = { name: DEMO_USER.name, email: DEMO_USER.email };
        saveUser(nextUser);
        setAuthError(null);
        return { ok: true };
      }

      const error = { type: "auth_required", message: "Invalid email or password" };
      setAuthError(error);
      return { ok: false, message: error.message };
    },
    [saveUser],
  );

  const register = useCallback(
    ({ name, email }) => {
      const nextUser = { name, email };
      saveUser(nextUser);
      setAuthError(null);
      return { ok: true };
    },
    [saveUser],
  );

  const logout = useCallback(() => {
    saveUser(null);
    setAuthError(null);
  }, [saveUser]);

  const checkUserAuth = useCallback(() => {
    const storedUser = readUserFromStorage();
    setUser(storedUser);
    setAuthError(null);
    return storedUser;
  }, []);

  const navigateToLogin = useCallback(() => {
    window.location.href = "/login";
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoadingAuth: false,
      isLoadingPublicSettings: false,
      authError,
      authChecked: true,
      appPublicSettings: null,
      login,
      register,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState: () => {},
    }),
    [user, authError, login, register, logout, navigateToLogin, checkUserAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
