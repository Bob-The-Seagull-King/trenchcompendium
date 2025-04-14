import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of your global state
interface AuthContextType {
    authToken: string | null;
    userId: number | null;
    isLoggedIn: boolean;
    login: (token: string, id: number) => void;
    logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
        setAuthToken(token);
        setUserId(id);
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('synodUserId');
        setAuthToken(null);
        setUserId(null);
    };

    const isLoggedIn = !!authToken && !!userId;

    return (
        <AuthContext.Provider value={{ authToken, userId, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};