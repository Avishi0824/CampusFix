import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import { User, Role } from '../types';
import { Storage, StorageKeys } from '../services/storage';
import { DEMO_USERS } from '../services/mockApi';
import { StudentTheme, DarkTheme, AppTheme } from '../theme';

interface AuthContextType {
  user: User | null;
  role: Role;
  theme: AppTheme;
  isLoading: boolean;
  login: (role: Role, customUser?: Partial<User>) => Promise<void>;
  switchRole: (role: Role) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserSession();
  }, []);

  const loadUserSession = async () => {
    try {
      const savedUser = await Storage.getItem<User | null>(
        StorageKeys.CURRENT_USER,
        null
      );

      if (savedUser) {
        setUser(savedUser);
      } else {
        // No saved session → show Role Selection/Login screen
        setUser(null);
      }
    } catch (e) {
      console.warn('Failed to load session:', e);

      // If session loading fails, show Login screen
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    role: Role,
    customUser?: Partial<User>
  ) => {
    const baseUser = DEMO_USERS[role];

    const loggedUser: User = {
      ...baseUser,
      ...customUser,
      role,
    };

    setUser(loggedUser);

    await Storage.setItem(
      StorageKeys.CURRENT_USER,
      loggedUser
    );
  };

  const switchRole = async (newRole: Role) => {
    const newUser = DEMO_USERS[newRole];

    setUser(newUser);

    await Storage.setItem(
      StorageKeys.CURRENT_USER,
      newUser
    );
  };

  const logout = async () => {
    setUser(null);

    await Storage.removeItem(
      StorageKeys.CURRENT_USER
    );
  };

  const currentRole: Role = user?.role || 'student';

  const currentTheme: AppTheme =
    currentRole === 'student'
      ? StudentTheme
      : DarkTheme;

  return (
    <AuthContext.Provider
      value={{
        user,
        role: currentRole,
        theme: currentTheme,
        isLoading,
        login,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};