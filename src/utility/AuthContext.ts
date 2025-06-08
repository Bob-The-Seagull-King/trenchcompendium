import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of your global state
interface AuthContextType {
    authToken: string | null;
    userId: number | null;
    isLoggedIn: () => boolean;
    login: (token: string, id: number) => void;
    logout: () => void;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);


// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};