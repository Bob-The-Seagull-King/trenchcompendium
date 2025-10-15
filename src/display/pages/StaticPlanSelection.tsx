/**
 * A Static page for membership plan selection
 */

import React, {useState} from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faChevronLeft, faChevronRight, faClose, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../utility/AuthContext";
import TCIcon from "../../resources/images/Trench-Companion-Icon.png";
import StaticFaq from "../static-content/StaticFaq";
import Modal from "react-bootstrap/Modal";
import PayPalSubButton from "../components/Profile/PayPalSubButton";
import {SYNOD} from "../../resources/api-constants";
import LoadingOverlay from "../components/generics/Loading-Overlay";
import PageMetaInformation from "../components/generics/PageMetaInformation";

const StaticPlanSelection: React.FC = () => {

    const navigate = useNavigate();
    const { isLoggedIn, userId, authToken,  loadingUser, SiteUser } = useAuth();

    const handleSunscription = (subscriptionID: string, planID: string) => {

        // Send tracking event
        let label = ''
        let value = 0

        if (planID == SYNOD.PP_PLAN_MONTH_ID) {
            label = 'monthly_plan'
            value = 199 / 100
        }
        if (planID == SYNOD.PP_PLAN_YEAR_ID) {
            label = 'yearly_plan'
            value = 1999 / 100
        }

        alert('Subscription successful with ID: '+ subscriptionID);

        // Fallback:
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    };

    /** Monthly */
    const [purchaseMonthlyModalOpen, setPurchaseMonthlyModalOpen] = useState(false);
    const handleClosePurchaseMonthly = () => setPurchaseMonthlyModalOpen(false);
    const benefitsMonthly = [
        "Get the first monthly membership for free",
        "Cancel any time - no questions asked",
        "Billed monthly",
        "Enjoy an ad-free experience",
        "Unlock extra features for your account",
    ];

    const [agreeTermsM, setAgreeTermsM] = useState(false);
    const [agreePrivacyM, setAgreePrivacyM] = useState(false);
    const isFormValidM = agreeTermsM && agreePrivacyM;

    /** Yearly */
    const [purchaseYearlyModalOpen, setPurchaseYearlyModalOpen] = useState(false);
    const handleClosePurchaseYearly = () => setPurchaseYearlyModalOpen(false);
    const benefitsYearly = [
        "Save over 15% on your subscription",
        "Cancel any time - no questions asked",
        "Billed yearly",
        "Enjoy an ad-free experience",
        "Unlock extra features for your account",
    ];

    const [agreeTermsY, setAgreeTermsY] = useState(false);
    const [agreePrivacyY, setAgreePrivacyY] = useState(false);
    const isFormValidY = agreeTermsY && agreePrivacyY;

    if( loadingUser || !SiteUser ) {
        return (
            <div className={'StaticPlanSelection'}>
                <div className={'LoadingOverlay-wrap-100vh'}>
                    <LoadingOverlay
                        message={'Loading your Membership'}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="StaticPlanSelection page-static">
            <PageMetaInformation
                title={'Supporter Plans'}
                description={'Choose your Trench Companion supporter plan and help us build the best companion app for Trench Crusade. Unlock exclusive perks and go ad-free.'}
            />

            <div className={'container'}>
                <h1>
                    <a className={'headline-back-btn'}
                       href={'/profile/' + userId+''}
                       onClick={() => (
                           navigate('/profile/' + userId+'')
                       )}>
                        <FontAwesomeIcon icon={faChevronLeft} className={''}/>
                    </a>
                    {'Subscription Plans'}
                </h1>
            </div>

            <div className={'container'}>

                <div className={`PlanSelectionItem ${SiteUser.GetPlanID() === SYNOD.PP_PLAN_MONTH_ID ? 'current-plan' : ''}`}>
                    <h2>
                        {SYNOD.PLAN_M_NAME}
                    </h2>
                    { SiteUser.GetPlanID() == SYNOD.PP_PLAN_MONTH_ID && (
                        <div className={'current-plan-hint'}>
                            <FontAwesomeIcon icon={faCheck} className="icon-inline-left-l"/>
                            {'Your Current Plan'}
                        </div>
                    )}

                    <ul className={'details-list'}>
                        {benefitsMonthly.map((benefit, index) => (
                            <li key={index}>
                                <img src={TCIcon} alt="Icon" className={'icon'} width={20} height={20}/>
                                {benefit}
                            </li>
                        ))}
                    </ul>

                    <div className={'price-details'}>
                        <div className={'price-main'}>
                            <span className={'price-value'}>
                                {'$1.99'}
                            </span>
                            <span className={'price-cycle'}>
                                {' / month'}
                            </span>
                        </div>

                        <div className={'price-sub'}>
                            {'*VAT included'}
                        </div>
                    </div>

                    { SiteUser.GetPlanID() != SYNOD.PP_PLAN_MONTH_ID && (
                        <button className={'btn btn-primary select-plan-btn'}
                                onClick={() => setPurchaseMonthlyModalOpen(true)}
                        >
                            {'Select Plan'}
                            <FontAwesomeIcon icon={faChevronRight} className="icon-inline-right-l"/>
                        </button>
                    )}


                    <Modal show={purchaseMonthlyModalOpen} size="lg"
                           contentClassName="purchaseSubModal purchaseSubModalMonthly"
                           dialogClassName="" keyboard={true}
                           onhide={handleClosePurchaseMonthly}
                           centered>
                        <Modal.Header closeButton={false}>
                            <Modal.Title>{SYNOD.PLAN_M_NAME}</Modal.Title>

                            <FontAwesomeIcon
                                icon={faXmark}
                                className="modal-close-icon"
                                role="button"
                                onClick={handleClosePurchaseMonthly}
                            />
                        </Modal.Header>

                        <Modal.Body >
                            <div className={'benefits-wrap'}>
                                <ul className={'benefits-list'}>
                                    {benefitsMonthly.map((benefit, index) => (
                                        <li key={index}>
                                            <img src={TCIcon} alt="Icon" className={'icon'} width={20} height={20}/>
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={'details-wrap'}>
                                <div className={'details-wrap-headline'}>
                                    {'Product Details'}
                                </div>

                                <ul className={'details-list'}>
                                    <li>
                                    <span className={'label'}>
                                        {'Billing cycle: '}
                                    </span>
                                        <span>
                                        {'monthly'}
                                    </span>
                                    </li>
                                    <li>
                                    <span className={'label'}>
                                        {'Payment via: '}
                                    </span>
                                        <span>
                                        {'Paypal'}
                                    </span>
                                    </li>
                                    <li>
                                    <span className={'label'}>
                                        {'Price: '}
                                    </span>
                                        <span>
                                        {'$1.99 / month (VAT included)'}
                                    </span>
                                    </li>

                                    <li>
                                    <span className={'label'}>
                                        {'Cancellation: '}
                                    </span>
                                        <span>
                                        {'The subscription can be cancelled at any time'}
                                    </span>
                                    </li>
                                </ul>

                                <div className="form-check mb-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="agreePrivacyM"
                                        checked={agreePrivacyM}
                                        onChange={(e) => setAgreePrivacyM(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="agreePrivacyM">
                                        {'I have read the privacy information'}
                                    </label>
                                </div>

                                <div className="form-check mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="agreeTermsM"
                                        checked={agreeTermsM}
                                        onChange={(e) => setAgreeTermsM(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="agreeTermsM">
                                        {'I accept the terms and conditions'}
                                    </label>
                                </div>

                                <div className={'fine-print'}>
                                    {'By clicking the button below, I agree that the service will begin immediately and I expressly waive my 14-day right of withdrawal.'}
                                </div>
                                <div className={'fine-print'}>
                                    {'By clicking ‘Subscribe with PayPal’, you are entering into a paid subscription agreement.'}
                                </div>
                            </div>

                            <div className={`submit-wrap ${!isFormValidM ? 'disabled' : ''}`}>
                                <PayPalSubButton
                                    planId={SYNOD.PP_PLAN_MONTH_ID}
                                    onSuccess={(subscriptionID) => {
                                        handleSunscription(subscriptionID, SYNOD.PP_PLAN_MONTH_ID);
                                    }}
                                />
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>

                <div className={`PlanSelectionItem ${SiteUser.GetPlanID() === SYNOD.PP_PLAN_YEAR_ID ? 'current-plan' : ''}`}>
                    <h2>
                        {SYNOD.PLAN_Y_NAME}
                    </h2>

                    { SiteUser.GetPlanID() == SYNOD.PP_PLAN_YEAR_ID && (
                        <div className={'current-plan-hint'}>
                            <FontAwesomeIcon icon={faCheck} className="icon-inline-left-l"/>
                            {'Your Current Plan'}
                        </div>
                    )}

                    <ul className={'details-list'}>
                        {benefitsYearly.map((benefit, index) => (
                            <li key={index}>
                                <img src={TCIcon} alt="Icon" className={'icon'} width={20} height={20}/>
                                {benefit}
                            </li>
                        ))}
                    </ul>

                    <div className={'price-details'}>
                        <div className={'price-main'}>
                            <span className={'price-value'}>
                                {'$19.99'}
                            </span>
                            <span className={'price-cycle'}>
                                {' / year'}
                            </span>
                        </div>

                        <div className={'price-sub'}>
                            {'*VAT included'}
                        </div>
                    </div>

                    { SiteUser.GetPlanID() != SYNOD.PP_PLAN_YEAR_ID && (
                        <button className={'btn btn-primary select-plan-btn'}
                                onClick={() => setPurchaseYearlyModalOpen(true)}
                        >
                            {'Select Plan'}
                            <FontAwesomeIcon icon={faChevronRight} className="icon-inline-right-l"/>
                        </button>
                    )}

                </div>

                <Modal show={purchaseYearlyModalOpen} size="lg"
                       contentClassName="purchaseSubModal purchaseSubModalYearly"
                       dialogClassName="" keyboard={true}
                       onhide={handleClosePurchaseYearly}
                       centered>
                    <Modal.Header closeButton={false}>
                        <Modal.Title>{SYNOD.PLAN_Y_NAME}</Modal.Title>

                        <FontAwesomeIcon
                            icon={faXmark}
                            className="modal-close-icon"
                            role="button"
                            onClick={handleClosePurchaseYearly}
                        />
                    </Modal.Header>
                    <Modal.Body >
                        <div className={'benefits-wrap'}>
                            <ul className={'benefits-list'}>
                                {benefitsYearly.map((benefit, index) => (
                                    <li key={index}>
                                        <img src={TCIcon} alt="Icon" className={'icon'} width={20} height={20}/>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={'details-wrap'}>
                            <div className={'details-wrap-headline'}>
                                {'Product Details'}
                            </div>

                            <ul className={'details-list'}>
                                <li>
                                    <span className={'label'}>
                                        {'Billing cycle: '}
                                    </span>
                                    <span>
                                        {'yearly'}
                                    </span>
                                </li>
                                <li>
                                    <span className={'label'}>
                                        {'Payment via: '}
                                    </span>
                                    <span>
                                        {'Paypal'}
                                    </span>
                                </li>
                                <li>
                                    <span className={'label'}>
                                        {'Price: '}
                                    </span>
                                    <span>
                                        {'$19.99 / year (VAT included)'}
                                    </span>
                                </li>

                                <li>
                                    <span className={'label'}>
                                        {'Cancellation: '}
                                    </span>
                                    <span>
                                        {'The subscription can be cancelled at any time'}
                                    </span>
                                </li>
                            </ul>

                            <div className="form-check mb-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="agreePrivacyY"
                                    checked={agreePrivacyY}
                                    onChange={(e) => setAgreePrivacyY(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="agreePrivacyY">
                                    {'I have read the privacy information'}
                                </label>
                            </div>

                            <div className="form-check mb-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="agreeTermsY"
                                    checked={agreeTermsY}
                                    onChange={(e) => setAgreeTermsY(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="agreeTermsY">
                                    {'I accept the terms and conditions'}
                                </label>
                            </div>

                            <div className={'fine-print'}>
                                {'By clicking the button below, I agree that the service will begin immediately and I expressly waive my 14-day right of withdrawal.'}
                            </div>
                            <div className={'fine-print'}>
                                {'By clicking ‘Subscribe with PayPal’, you are entering into a paid subscription agreement.'}
                            </div>
                        </div>

                        <div className={`submit-wrap ${!isFormValidY ? 'disabled' : ''}`}>
                            <PayPalSubButton
                                planId={SYNOD.PP_PLAN_YEAR_ID}
                                onSuccess={(subscriptionID) => {
                                    handleSunscription(subscriptionID, SYNOD.PP_PLAN_YEAR_ID);
                                }}
                            />
                        </div>
                    </Modal.Body>
                </Modal>
            </div>

            <div className={'spacer-20'}></div>

            <div className={'container mt-3'}>
                <h2>
                    {'Frequently asked questions'}
                </h2>

                <StaticFaq
                    title={'How can I cancel my subscription?'}
                    content={
                        <>
                            {'You can cancel your subscription by going into your account settings or by cancelling it in the paypal app. Your membership will stay active until the next billing cycle.'}
                        </>
                    }
                />
                <StaticFaq
                    title={'How is the membership paid?'}
                    content={
                        <>
                            {'The Payment will be made with paypal subscription. You can use your paypal account or credit card.'}
                        </>
                    }
                />
                <StaticFaq
                    title={'Why do you offer a premium membership?'}
                    content={
                        <>
                            {'Creating Trench Companion is a passion project but still requires a lot of work to make it work. The premium membership is completely voluntary and helps us to develop new features and keep improving the app.'}
                        </>
                    }
                />
                <StaticFaq
                    title={'What benefits do I get with the plus membership?'}
                    content={
                        <>
                            {'You will get several benefits, that are purely optional like choosing custom profile pictures and other cosmetic features. Ads will be disabled for plus members. You will also get a warm and fuzzy feeling for supporting the developers of this app. We plan to add more additional features for plus members in the future.'}
                        </>
                    }
                />
            </div>
        </div>
    )
}

export default StaticPlanSelection
