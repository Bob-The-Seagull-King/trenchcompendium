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
        const logindate = localStorage.getItem('lastrecordedlogindate');
        if (storedToken && storedUserId && logindate) {
            const date_stored = new Date(logindate);
            const date_cur = new Date();
            const diff = Math.ceil(Math.abs(date_cur.getTime() - date_stored.getTime()) / (1000 * 3600 * 24)); 
            if (diff <= 22) {
                setAuthToken(storedToken);
                setUserId(parseInt(storedUserId, 10));
            } else {
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('synodUserId');
                localStorage.removeItem('lastrecordedlogindate');   
            }
        } else {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('synodUserId');
            localStorage.removeItem('lastrecordedlogindate');   
        }
    }, []);

    const login = (token: string, id: number) => {
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('synodUserId', id.toString());
        localStorage.setItem('lastrecordedlogindate', (new Date()).toISOString());

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