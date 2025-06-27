import React, {useState} from 'react';
import PayPalSubButton from "./PayPalSubButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight, faClose, faXmark} from "@fortawesome/free-solid-svg-icons";
import TCIcon from '../../../resources/images/Trench-Companion-Icon.png';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../utility/AuthContext";
import {ROUTES} from "../../../resources/routes-constants";
import Modal from "react-bootstrap/Modal";
import {SYNOD} from "../../../resources/api-constants";
import {synodCancelSubscription} from "../../../utility/SynodSubscriptionFunctions";
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
    const isSubscribed = true;

    const navigate = useNavigate();
    const { isLoggedIn, userId, authToken, logout } = useAuth();

    const [cancelSubModalOpen, setCancelSubModalOpen] = useState(false);
    const handleCloseCancelSub = () => setCancelSubModalOpen(false);

    const handleCancelSub = async (subscriptionId: string) => {
        try {
            const result = await synodCancelSubscription(subscriptionId);
            alert(result.message || 'Subscription cancelled!');
            // Optionally reload or update local state here
        } catch {
            alert('Could not cancel subscription.');
        }
    };


    return (
        <div className={'ProfileSubscriptionView'}>

            { isSubscribed ? (
                <>
                    <h3>{'Your Plan'}</h3>
                    <h4>{'Trench Companion plus monthly'}</h4>{/* @TODO: replace with actual data */}

                    <ul className={'details-list'}>
                        <li>{'Subscription Status: '}{'Active'}</li>
                        <li>{'Next Payment: '}{'01.01.2026'}</li>
                        <li>{'Subscription ID: '}{'I-S4UA948NKD4V'}</li>
                    </ul>

                    <a className={'btn btn-primary'}
                        href={ROUTES.PAGE_PLAN_SELECTION}
                       onClick={() => (
                        navigate(ROUTES.PAGE_PLAN_SELECTION)
                    )}
                    >
                        {'Change Plans'}
                    </a>

                    <button className={'btn btn-secondary secondary-action'}
                            onClick={() => setCancelSubModalOpen(true)}
                    >
                        <FontAwesomeIcon icon={faClose} className="icon-inline-left-s"/>
                        {'Cancel Subscription'}
                    </button>

                    <Modal show={cancelSubModalOpen} size="lg"
                           contentClassName=""
                           dialogClassName="" keyboard={true}
                           onhide={handleCloseCancelSub}
                           centered>
                        <Modal.Header closeButton={false}>
                            <Modal.Title>Cancel your subscription</Modal.Title>

                            <FontAwesomeIcon
                                icon={faXmark}
                                className="modal-close-icon"
                                role="button"
                                onClick={handleCloseCancelSub}
                            />
                        </Modal.Header>

                        <Modal.Body>
                            <p><i>
                                {'We are sad to see you go. We hope to see you again in the future.'}
                            </i></p>

                            <hr />

                            <p>
                                {'Do you really want to cancel your subscription? '}
                            </p>

                            <button className={'btn btn-primary'}
                                    onClick={() => handleCancelSub('I-S4UA948NKD4V')}
                            >
                                {'Cancel Subscription'}
                            </button>
                        </Modal.Body>
                    </Modal>
                </>
            ) : (
                <>
                    <h3>{'Support the Project'}</h3>
                    <h4>{'Trench Companion plus'}</h4>

                    <ul className={'details-list'}>
                        <li>
                            <img src={TCIcon} alt="Icon" className={'icon'} width={20} height={20}/>
                            {'Membership starting from $1,67 monthly'}
                        </li>
                        <li>
                            <img src={TCIcon} alt="Icon" className={'icon'} width={20} height={20}/>
                            {'The first month is free'}
                        </li>
                        <li>
                            <img src={TCIcon} alt="Icon" className={'icon'} width={20} height={20}/>
                            {'Support the project'}
                        </li>
                        <li>
                            <img src={TCIcon} alt="Icon" className={'icon'} width={20} height={20}/>
                            {'Disable Ads'}
                        </li>
                        <li>
                            <img src={TCIcon} alt="Icon" className={'icon'} width={20} height={20}/>
                            {'Unlock extra features for your account'}
                        </li>
                    </ul>

                    <a className={'btn btn-primary'}
                       href={ROUTES.PAGE_PLAN_SELECTION}
                       onClick={() => (
                           navigate(ROUTES.PAGE_PLAN_SELECTION)
                       )}
                    >
                        {'See Plans'}
                        <FontAwesomeIcon icon={faChevronRight} className="icon-inline-right-l"/>
                    </a>
                </>
            )}


            {/*<PayPalSubButton onSuccess={handleSubscriptionSuccess} />*/}


        </div>
    );
};

export default ProfileSubscriptionView;
