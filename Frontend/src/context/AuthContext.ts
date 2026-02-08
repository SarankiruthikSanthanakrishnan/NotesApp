import { createContext } from 'react';

export interface User {
  id: number;
  username: string;
  email: string;
  contact: string;
  profile_image: string;
}

interface ContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<ContextType | null>(null);
