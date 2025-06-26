import React from 'react';
import PayPalSubButton from "./PayPalSubButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight, faClose} from "@fortawesome/free-solid-svg-icons";
import TCIcon from '../../../resources/images/Trench-Companion-Icon.png';
/**
 * This component shows the subscription management
 *
 * @constructor
 */
const ProfileSubscriptionView: React.FC = () => {

    // additional handlers on subscription success go here.
    // const handleSubscriptionSuccess = (subId: string) => {
    //     alert ('sub successful with ID ' + subId);
    //
    //     window.location.reload(); // fallback for now
    // };

    // @TODO: This is a placeholder var -> replace with user status
    const isSubscribed = false;

    return (
        <div className={'ProfileSubscriptionView'}>

            { isSubscribed ? (
                <>
                    <h3>{'Your Plan'}</h3>
                    <h4>{'Trench Companion plus monthly'}</h4>{/* @TODO: replace with actual data */}

                    <ul className={'details-list'}>
                        <li>{'Subscription Status: '}{'Active'}</li>
                        <li>{'Next Payment: '}{'01.01.2026'}</li>
                        <li>{'Subscription ID: '}{'X-362904519-P'}</li>
                    </ul>

                    <button className={'btn btn-primary'}>
                        {'Change Plans'}
                    </button>

                    <button className={'btn btn-secondary secondary-action'}>
                        <FontAwesomeIcon icon={faClose} className="icon-inline-left-s"/>
                        {'Cancel Subscription'}
                    </button>
                </>
            ) : (
                <>
                    <h3>{'Support the Project'}</h3>
                    <h4>{'Trench Companion plus'}</h4>

                    <ul className={'details-list'}>
                        <li>
                            <img src={TCIcon} alt="Icon" className={'icon'} width={32} height={32}/>
                            {'Membership starting from $1,67 monthly'}
                        </li>
                        <li>
                            <img src={TCIcon} alt="Icon" className={'icon'} width={32} height={32}/>
                            {'The first month is free'}
                        </li>
                        <li>
                            <img src={TCIcon} alt="Icon" className={'icon'} width={32} height={32}/>
                            {'Support the project'}
                        </li>
                        <li>
                            <img src={TCIcon} alt="Icon" className={'icon'} width={32} height={32}/>
                            {'Disable Ads'}
                        </li>
                        <li>
                            <img src={TCIcon} alt="Icon" className={'icon'} width={32} height={32}/>
                            {'Unlock extra features for your account'}
                        </li>
                    </ul>

                    <button className={'btn btn-primary'}>
                        {'See Plans'}
                        <FontAwesomeIcon icon={faChevronRight} className="icon-inline-right-l"/>
                    </button>

                </>
            )}


            {/*<PayPalSubButton onSuccess={handleSubscriptionSuccess} />*/}


        </div>
    );
};

export default ProfileSubscriptionView;
