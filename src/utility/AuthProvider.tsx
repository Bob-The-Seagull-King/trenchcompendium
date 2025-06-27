import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { ToolsController } from '../classes/_high_level_controllers/ToolsController';
import {SiteUser} from "../classes/user_synod/site_user";
import {UserFactory} from "../factories/synod/UserFactory";

// Create the provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);

    const [SiteUser, setSiteUser] = useState<SiteUser | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState((!!authToken && !!userId));

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
        setIsLoggedIn((!!authToken && !!userId));
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('synodUserId');

        const toolscont : ToolsController = ToolsController.getInstance();
        toolscont.UserWarbandManager.RemoveLoggedUser();

        setAuthToken(null);
        setUserId(null);
        setIsLoggedIn((!!authToken && !!userId));
    };


    const reloadIsLoggedIn = () => {
        setIsLoggedIn((!!authToken && !!userId));        
    }

    /**
     * Load user data if is logged in
     */
    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) {
                setSiteUser(null);
                setLoadingUser(false);
                return;
            }

            try {
                const user = await UserFactory.CreatePrivateUserByID(userId);
                setSiteUser(user);
            } catch (err) {
                console.error('Error loading user data:', err);
                setSiteUser(null);
            } finally {
                setLoadingUser(false);
            }
        };

        setIsLoggedIn((!!authToken && !!userId));
        fetchUserData();
    }, [userId]);

    return (
        <AuthContext.Provider value={{
            authToken,
            userId,
            isLoggedIn,
            reloadIsLoggedIn,
            login,
            logout,
            SiteUser,
            loadingUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
};