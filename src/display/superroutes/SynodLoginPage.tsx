import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SynodGetWarband from "../../utility/SynodGetWarband";
import SynodCreateWarband from "../../utility/SynodCreateWarband";
import SynodLogin from "../../utility/SynodLogin";
import SynodRegister from "../../utility/SynodRegister";
import SynodPasswordReset from "../../utility/SynodPasswordReset";
import SynodUpdateWarband from "../../utility/SynodUpdateWarband";
import SynodUserWarbands from "../../utility/SynodUserWarbands";

const SynodLoginPage: React.FC = () => {
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);

    // Load saved token & userId from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        const storedUserId = localStorage.getItem('synodUserId');

        if (storedToken && storedUserId) {
            setAuthToken(storedToken);
            setUserId(parseInt(storedUserId, 10));
        }
    }, []);

    const handleLogin = (token: string, id: number) => {
        setAuthToken(token);
        setUserId(id);
    };

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('synodUserId');
        setAuthToken(null);
        setUserId(null);
    };

    return (
        <div className="SynodLoginPage">
            <div className={'container'}>
                <div className={'row'}>

                    <h1>Login</h1>

                    {/* @TODO: this is just a test*/}
                    <SynodGetWarband
                        WarbandId={15}
                    />

                    <hr/>


                    <SynodLogin onLogin={handleLogin}/>

                    <hr/>

                    <button onClick={handleLogout} style={{marginLeft: '1rem'}}>
                        Logout
                    </button>

                    <hr/>

                    <SynodRegister
                    />

                    <hr/>

                    <SynodPasswordReset/>

                </div>

                <hr/>

                <div className={'row'}>
                    <div className={'col'}>
                        <SynodGetWarband
                            WarbandId={15}
                        />

                        <SynodUserWarbands />
                    </div>

                </div>

                <hr/>

                <div className={'row'}>
                    <div className={'col col-sm-6'}>
                        {authToken && userId && (
                            <SynodCreateWarband authToken={authToken} userId={userId}/>
                        )}
                    </div>
                    <div className={'col col-sm-6'}>
                        {authToken && userId && (
                            <SynodUpdateWarband authToken={authToken} userId={userId}/>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SynodLoginPage;