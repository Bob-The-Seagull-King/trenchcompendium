import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { ToolsController } from '../classes/_high_level_controllers/ToolsController';
import {SiteUser} from "../classes/user_synod/site_user";
import {UserFactory} from "../factories/synod/UserFactory";
import { SYNOD } from '../resources/api-constants';

// Create the provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null | undefined>(undefined);

    const [SiteUser, setSiteUser] = useState<SiteUser | null>(null);
    const [loadingUser, setLoadingUser] = useState(true); // is this currently trying to load a user
    const [isLoggedIn, setIsLoggedIn] = useState((!!authToken && !!userId));

    /**
     * Load saved credentials from localStorage
     */
    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        const storedUserId = localStorage.getItem('synodUserId');
        const logindate = localStorage.getItem('lastrecordedlogindate');
        if (storedToken && storedUserId && logindate) {
            const date_stored = new Date(logindate);
            const date_cur = new Date();
            const diff = Math.ceil(Math.abs(date_cur.getTime() - date_stored.getTime()) / (1000 * 3600 * 24)); 
            if (diff <= 14) {
                setAuthToken(storedToken);
                setUserId(parseInt(storedUserId, 10));
                UpdateTokenValue();
            } else {
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('synodUserId');
                localStorage.removeItem('lastrecordedlogindate');
                setUserId(null);
            }
        } else {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('synodUserId');
            localStorage.removeItem('lastrecordedlogindate');
            setUserId(null);

        }
    }, []);

    /**
     * Refresh the users login creds
     * @constructor
     */
    async function UpdateTokenValue() {
        const token = localStorage.getItem('jwtToken')
        const response = await fetch(`${SYNOD.URL}/wp-json/synod-auth/v1/refresh`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        const json : any = await response.json();
        localStorage.setItem('jwtToken', json.token);
        localStorage.setItem('lastrecordedlogindate', (new Date()).toISOString());
        setAuthToken(json.token);
    }

    /**
     * Set user credentials on login
     * @param token
     * @param id
     */
    const login = (token: string, id: number) => {
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('synodUserId', id.toString());
        localStorage.setItem('lastrecordedlogindate', (new Date()).toISOString());

        const toolscont : ToolsController = ToolsController.getInstance();
        toolscont.UserWarbandManager.SetLoggedUser(id);

        setAuthToken(token);
        setUserId(id);
        setIsLoggedIn((!!authToken && !!userId));

        setLoadingUser(false); // after a login -> No more loading required
    };

    /**
     * Set user credentials on logout
     * @param token
     * @param id
     */
    const logout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('synodUserId');

        const toolscont : ToolsController = ToolsController.getInstance();
        toolscont.UserWarbandManager.RemoveLoggedUser();

        setAuthToken(null);
        setUserId(null);
        setIsLoggedIn((!!authToken && !!userId));

        setLoadingUser(false);  // after a logout -> No more loading required
    };


    const reloadIsLoggedIn = () => {
        setIsLoggedIn((!!authToken && !!userId));        
    }

    /**
     * Load user data if is logged in
     */
    useEffect(() => {
        const fetchUserData = async () => {

            // when user ID tried to load and its not available
            // -> User is definitely NOT logged in
            if (userId == null) {
                setSiteUser(null);

                setLoadingUser(false); // no more loading required
                return;
            }

            setLoadingUser(true); // will load the user next

            try {
                const user = await UserFactory.CreatePrivateUserByID(userId);
                setSiteUser(user);
            } catch (err) {
                console.error('Error loading user data:', err);
                setSiteUser(null);
            } finally {
                setLoadingUser(false); // user loading has finished
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