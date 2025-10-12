import React from "react";
import {useAuth} from "../../../utility/AuthContext";
import LoadingOverlay from "../generics/Loading-Overlay";
import TCIcon from "../../../resources/images/Trench-Companion-Icon.png";
import {ROUTES} from "../../../resources/routes-constants";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {Link, useNavigate} from "react-router-dom";

export const ProfileCreatorView: React.FC = () => {

    const { isLoggedIn, userId, authToken, logout, SiteUser, loadingUser } = useAuth();

    const navigate = useNavigate();

    /**
     * Fallback, if the user data is still loading
     */
    if( loadingUser || !SiteUser ) {
        return (
            <div className={'ProfileCreatorView'}>
                <LoadingOverlay
                    message={'Loading your Membership'}
                />
            </div>
        );
    }

    return (
        <div className="ProfileCreatorView">
            { SiteUser.IsCreator() ? (
                <></>
            ):(
                <>
                { SiteUser.IsCreatorApplicationPending() ? (
                    <>
                        <h3>{'Your Creator application'}</h3>
                        <p>
                            {'Your application has been received.'}
                        </p>
                    </>
                ) : (
                    <>
                        <h3>{'Join the creator program'}</h3>
                        <p>{'Register as a creator and promote your Trench Crusade STL on Trench Companion.'}</p>

                        <Link
                            to={ROUTES.PAGE_CREATOR_APPLICATION}
                            className="btn btn-primary"
                        >
                            {'Apply here'}
                            <FontAwesomeIcon icon={faChevronRight} className="icon-inline-right-l"/>
                        </Link>
                    </>
                )}
                </>
            )}
        </div>
    );
};

export default ProfileCreatorView;