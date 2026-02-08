import { useEffect, useState } from 'react';
import { AuthContext, type User } from './AuthContext';
import axios from 'axios';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const userData = await axios.get('http://localhost:5000/api/auth/me', {
        withCredentials: true,
      });
      setUser(userData.data);
      console.log('User fetched successfully', userData.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { username, password },
        { withCredentials: true }
      );
      if (response.data.message === 'Login Successfully') {
        await fetchUser();
        return true;
      }
      setUser(null);
      return false;
    } catch (error) {
      setUser(null);
      console.log(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post(
        'http://localhost:5000/api/auth/logout',
        {},
        { withCredentials: true }
      );
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, fetchUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
