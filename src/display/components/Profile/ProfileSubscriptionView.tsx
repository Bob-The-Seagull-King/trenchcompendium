import React, {useEffect, useState} from 'react';
import PayPalSubButton from "./PayPalSubButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight, faClose, faFileInvoice, faXmark} from "@fortawesome/free-solid-svg-icons";
import TCIcon from '../../../resources/images/Trench-Companion-Icon.png';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../utility/AuthContext";
import {ROUTES} from "../../../resources/routes-constants";
import Modal from "react-bootstrap/Modal";
import {SYNOD} from "../../../resources/api-constants";
import {synodCancelSubscription} from "../../../utility/SynodSubscriptionFunctions";
import LoadingOverlay from "../generics/Loading-Overlay";
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
    const { isLoggedIn, userId, authToken, logout, SiteUser, loadingUser } = useAuth();

    const [cancelSubModalOpen, setCancelSubModalOpen] = useState(false);
    const handleCloseCancelSub = () => setCancelSubModalOpen(false);

    const handleCancelSub = async (subscriptionId: string) => {
        try {
            const result = await synodCancelSubscription(subscriptionId);
            alert(result.message || 'Subscription cancelled!');
            window.location.reload();
            // Optionally reload or update local state here
        } catch {
            alert('Could not cancel subscription.');
        }
    };

    /**
     * Fallback, if the user data is still loading
     */
    if( loadingUser || !SiteUser ) {
        return (
            <div className={'ProfileSubscriptionView'}>
                <LoadingOverlay
                    message={'Loading your Membership'}
                />
            </div>
        );
    }

    /**
     * Invoices Modal
     */
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loadingInvoices, setLoadingInvoices] = useState(false);
    const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

    const fetchInvoicesForUser = async (): Promise<any[]> => {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${SYNOD.URL}/wp-json/synod-payment/v1/user-invoices`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to load invoices');
        return await response.json();
    };

    useEffect(() => {
        if (invoiceModalOpen) {
            setLoadingInvoices(true);
            // Replace with your real fetch logic
            fetchInvoicesForUser()
                .then((data) => {
                    setInvoices(data);
                })
                .catch((err) => {
                    console.error('Error fetching invoices:', err);
                })
                .finally(() => {
                    setLoadingInvoices(false);
                });
        }
    }, [invoiceModalOpen]);



    return (
        <div className={'ProfileSubscriptionView'}>

            { SiteUser.IsPremium() ? (
                <>
                    <h3>{'Your Plan'}</h3>
                    <h4>
                        {/* Monthly Sub */}
                        { SiteUser.GetPlanID() == SYNOD.PP_PLAN_MONTH_ID && (
                            <>
                                {SYNOD.PLAN_M_NAME}
                            </>
                        )}

                        {/* Yearly Sub */}
                        { SiteUser.GetPlanID() == SYNOD.PP_PLAN_YEAR_ID && (
                            <>
                                {SYNOD.PLAN_Y_NAME}
                            </>
                        )}

                        {/* Other Means */}
                        { (SiteUser.GetPlanID() != SYNOD.PP_PLAN_MONTH_ID && SiteUser.GetPlanID() != SYNOD.PP_PLAN_YEAR_ID )&& (
                            <>
                                {'Trench Companion Plus'}
                            </>
                        )}

                    </h4>

                    <ul className={'details-list'}>
                        <li>{'Membership Status: '}{'Active'}</li>
                        <li>{'Next Payment: '}{SiteUser.PremiumUntilFormat()}</li>
                        <li>{'Subscription ID: '}
                            { SiteUser.GetSubscriptionID() ? (
                                <>
                                    {SiteUser.GetSubscriptionID()}
                                </>
                            ):(
                                <>
                                    {'No active subscription'}
                                </>
                            ) }

                        </li>
                        <li className={'clickable'} onClick={
                            () => setInvoiceModalOpen(true)
                        }>
                            <FontAwesomeIcon icon={faFileInvoice} className="icon-inline-left"/>
                            {'Your Invoices'}
                        </li>
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
                                onClick={() => handleCancelSub(SiteUser.GetSubscriptionID())}
                            >
                                {'Cancel Subscription'}
                            </button>
                        </Modal.Body>
                    </Modal>

                    <Modal show={invoiceModalOpen} size="lg"
                           contentClassName=""
                           dialogClassName="" keyboard={true}
                           onhide={setInvoiceModalOpen}
                           centered>
                        <Modal.Header closeButton={false}>
                            <Modal.Title>Your Invoices</Modal.Title>

                            <FontAwesomeIcon
                                icon={faXmark}
                                className="modal-close-icon"
                                role="button"
                                onClick={
                                    () => setInvoiceModalOpen(false)
                                }
                            />
                        </Modal.Header>

                        <Modal.Body>
                            {loadingInvoices ? (
                                <div className={'LoadingOverlay-wrap-150'}>
                                    <LoadingOverlay
                                        message={'Loading your Invoices'}
                                    />
                                </div>

                            ) : (
                                <div className={'ProfileInvoiceList'}>
                                    {invoices.length === 0 ? (
                                        <p>No invoices found.</p>
                                    ) : (
                                        <ul className="invoice-list">
                                            {invoices.map((invoice, i) => (
                                                <li className="invoice-item" key={i}>
                                                    <a href={invoice.invoice_pdf_url} target={'_blank'} rel={'noreferrer'} download>
                                                        {'Transaction-ID: ' + invoice.paypal_transaction_id}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                            <button className={'btn btn-primary'}
                                onClick={
                                    () => setInvoiceModalOpen(false)
                                }
                            >
                                {'Close'}
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
