import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { ToolsController } from '../classes/_high_level_controllers/ToolsController';

// Create the provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);

    // Load saved credentials from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        const storedUserId = localStorage.getItem('synodUserId');
        if (storedToken && storedUserId) {
            setAuthToken(storedToken);
            setUserId(parseInt(storedUserId, 10));
        }
    }, []);

    const login = (token: string, id: number) => {
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('synodUserId', id.toString());

        const toolscont : ToolsController = ToolsController.getInstance();
        toolscont.UserWarbandManager.SetLoggedUser(id);

        setAuthToken(token);
        setUserId(id);
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('synodUserId');

        const toolscont : ToolsController = ToolsController.getInstance();
        toolscont.UserWarbandManager.RemoveLoggedUser();

        setAuthToken(null);
        setUserId(null);
    };

    const isLoggedIn = () => {return (!!authToken && !!userId);}

    return (
        <AuthContext.Provider value={{ authToken, userId, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};