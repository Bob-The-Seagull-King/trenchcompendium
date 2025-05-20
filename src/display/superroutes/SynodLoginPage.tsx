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
import {useAuth} from "../../utility/AuthContext";

const SynodLoginPage: React.FC = () => {
    const [authToken, setAuthToken] = useState<string | null>(null);
    // const [userId, setUserId] = useState<number | null>(null);

    const [visbibleLogin, setvisbibleLogin] = useState(true);
    const [visbibleSignup, setvisbibleSignup] = useState(false);
    const [visbibleReset, setvisbibleReset] = useState(false);

    const { userId, isLoggedIn, login, logout } = useAuth();

    const showLogin = async function () {
        setvisbibleLogin(true);
        setvisbibleSignup(false);
        setvisbibleReset(false);
    }

    const showSignup = async function () {
        setvisbibleLogin(false);
        setvisbibleSignup(true);
        setvisbibleReset(false);
    }
    const showReset = async function () {
        setvisbibleLogin(false);
        setvisbibleSignup(false);
        setvisbibleReset(true);
    }

    return (
        <div className="SynodLoginPage">
            <div className={'container'}>
                <div className={'row'}>

                    {visbibleLogin &&
                        <div className={"synod-login-wrap synod-login-form"}>
                            <SynodLogin/>

                            {!isLoggedIn &&
                                <>
                                    <div className={'login-btn-spacer'}>
                                        {'or'}
                                    </div>

                                    <button
                                        className={'show-signup-btn btn btn-secondary'}
                                        onClick={showSignup}
                                    >
                                        {'Sign Up instead'}
                                    </button>
                                </>
                            }

                            {isLoggedIn &&
                                <button
                                    className={'btn btn-secondary'}
                                    onClick={logout}
                                >
                                    {'Logout'}
                                </button>
                            }

                            <div
                                className={'reset-toggle'}
                                onClick={showReset}>
                                {'Reset your password?'}
                            </div>
                        </div>
                    }


                    {visbibleSignup &&
                        <div className={"synod-signup-wrap synod-login-form"}>
                            <SynodRegister/>

                            <div className={'login-btn-spacer'}>
                                {'or'}
                            </div>

                            <button
                                className={'show-signup-btn  btn btn-secondary'}
                                onClick={showLogin}
                            >
                                {'Log In instead'}
                            </button>


                        </div>
                    }

                    {visbibleReset &&
                        <div className={"synod-reset-wrap synod-login-form"}>
                            <SynodPasswordReset/>

                            <div className={'login-btn-spacer'}>
                                {'or'}
                            </div>

                            <button
                                className={'show-signup-btn  btn btn-secondary'}
                                onClick={showLogin}
                            >
                                {'Log In instead'}
                            </button>
                        </div>
                    }
                </div>
            </div>

            <div className={"container mt-3 pt-3"}>
            <hr className={'mt-3'}/>
                {/* @TODO: Debug screen*/}
                {/*<SynodGetWarband*/}
                {/*    WarbandId={15}*/}
                {/*/>*/}

                <div className={'row'}>
                    <div className={'col'}>
                        {/*<SynodGetWarband*/}
                        {/*    WarbandId={15}*/}
                        {/*/>*/}

                        <SynodUserWarbands/>
                    </div>

                </div>

                <hr />

                <div className={'row'}>
                    <div className={'col col-sm-6'}>
                        {isLoggedIn && (
                            <SynodCreateWarband/>
                        )}
                    </div>
                    <div className={'col col-sm-6'}>
                        {isLoggedIn && (
                            <SynodUpdateWarband/>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SynodLoginPage;