'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  customerLogin as apiLogin,
  customerRegister as apiRegister,
  getCustomerProfile,
  updateCustomerProfile,
} from '@/app/api/authapi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize customer session on mount
  useEffect(() => {
    async function loadSession() {
      try {
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem('iconic_customer_token');
          const storedUser = localStorage.getItem('iconic_customer_user');

          if (storedToken) {
            setToken(storedToken);
            if (storedUser) {
              try {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
              } catch (e) {
                console.error('Failed to parse cached user:', e);
              }
            }

            // Verify and refresh profile from server
            const res = await getCustomerProfile();
            if (res && (res.success || res.data)) {
              const freshUser = res.data || res.user;
              setUser(freshUser);
              setIsAuthenticated(true);
              localStorage.setItem('iconic_customer_user', JSON.stringify(freshUser));
            } else if (res && res.message && res.message.toLowerCase().includes('not authorized')) {
              // Token invalid or expired
              handleLogout();
            }
          }
        }
      } catch (err) {
        console.warn('Session verification issue:', err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, []);

  // Customer Login
  const login = async (credentials) => {
    try {
      const res = await apiLogin(credentials);
      if (res && (res.success || res.data?.token || res.token)) {
        const receivedUser = res.data || res.user || {};
        const receivedToken = res.data?.token || res.token;

        if (receivedToken) {
          localStorage.setItem('iconic_customer_token', receivedToken);
          setToken(receivedToken);
        }

        const userData = {
          _id: receivedUser._id || receivedUser.id,
          name: receivedUser.name,
          email: receivedUser.email,
          phone: receivedUser.phone || '',
          address: receivedUser.address || {},
          role: receivedUser.role || 'user',
        };

        localStorage.setItem('iconic_customer_user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);

        return {
          success: true,
          user: userData,
          message: res.message || 'Logged in successfully',
        };
      } else {
        return {
          success: false,
          message: res?.message || 'Invalid email or password',
        };
      }
    } catch (err) {
      return {
        success: false,
        message: err.message || 'Connection error. Please try again.',
      };
    }
  };

  // Customer Registration
  const register = async (userData) => {
    try {
      const res = await apiRegister(userData);
      if (res && (res.success || res.data?.token || res.token)) {
        const registeredUser = res.data || res.user || {};
        const receivedToken = res.data?.token || res.token;

        if (receivedToken) {
          localStorage.setItem('iconic_customer_token', receivedToken);
          setToken(receivedToken);
        }

        const formattedUser = {
          _id: registeredUser._id || registeredUser.id,
          name: registeredUser.name,
          email: registeredUser.email,
          phone: registeredUser.phone || '',
          address: registeredUser.address || {},
          role: registeredUser.role || 'user',
        };

        localStorage.setItem('iconic_customer_user', JSON.stringify(formattedUser));
        setUser(formattedUser);
        setIsAuthenticated(true);

        return {
          success: true,
          user: formattedUser,
          message: res.message || 'Account created successfully',
        };
      } else {
        return {
          success: false,
          message: res?.message || 'Registration failed. Please check your details.',
        };
      }
    } catch (err) {
      return {
        success: false,
        message: err.message || 'Connection error. Please try again.',
      };
    }
  };

  // Update Profile
  const updateProfile = async (profileData) => {
    try {
      const res = await updateCustomerProfile(profileData);
      if (res && (res.success || res.data)) {
        const updated = res.data;
        const updatedUser = {
          ...user,
          ...updated,
        };
        setUser(updatedUser);
        localStorage.setItem('iconic_customer_user', JSON.stringify(updatedUser));
        return { success: true, message: 'Profile updated successfully', user: updatedUser };
      } else {
        return { success: false, message: res?.message || 'Update failed' };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Logout
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('iconic_customer_token');
      localStorage.removeItem('iconic_customer_user');
    }
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        updateProfile,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

