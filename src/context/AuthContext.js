import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkUserLoggedIn = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userData = await AsyncStorage.getItem('user');

            if (token && userData) {
                // Optional: Validate token with backend explicitly if needed,
                // but for now relying on stored state.
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.log('checkUserLoggedIn error', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const login = async (phoneNumber, password) => {
        try {
            const response = await api.login({ phoneNumber, password });
            await AsyncStorage.setItem('token', response.token);
            await AsyncStorage.setItem('user', JSON.stringify(response.user));
            setUser(response.user);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.register(userData);
            return { success: true, message: response.message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
