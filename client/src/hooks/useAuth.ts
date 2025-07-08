import { useState, useEffect, useCallback } from 'react';
import { TaskApiService, handleApiError } from '../services/api';

// Add a custom event to notify auth changes
const AUTH_EVENT = 'authChanged';

interface UseAuthReturn {
  user: string | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<string | null>(localStorage.getItem('user'));
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth changes from other hooks/components
  useEffect(() => {
    const handler = () => {
      setToken(localStorage.getItem('token'));
      setUser(localStorage.getItem('user'));
    };
    window.addEventListener(AUTH_EVENT, handler);
    return () => window.removeEventListener(AUTH_EVENT, handler);
  }, []);

  // Login
  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await TaskApiService.login(username, password);
      
      setUser(username);
      setToken(response.token);
      
      localStorage.setItem('user', username);
      localStorage.setItem('token', response.token);
      
      window.dispatchEvent(new Event(AUTH_EVENT));
      
      return true;
    } catch (err: unknown) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Signup
  const signup = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await TaskApiService.signup(username, password);
      
      setUser(username);
      setToken(null); // Signup doesn't return a token, user needs to login
      
      localStorage.setItem('user', username);
      localStorage.removeItem('token');
      
      window.dispatchEvent(new Event(AUTH_EVENT));
      
      return true;
    } catch (err: unknown) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event(AUTH_EVENT));
  }, []);

  // Effect to sync state with localStorage
  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setUser(localStorage.getItem('user'));
  }, []);

  return {
    user,
    token,
    loading,
    error,
    login,
    signup,
    logout,
  };
}; 