/**
 * A Static page to promote and explain the paid membership
 */


import React from 'react'
import StaticParagraph from "../static-content/StaticParagraph";
import StaticImageText1 from "../static-content/StaticImageText-1";
import StaticFaq from "../static-content/StaticFaq";
import PageMetaInformation from "../components/generics/PageMetaInformation";
import {useNavigate} from "react-router-dom";
import CustomNavLink from "../components/subcomponents/interactables/CustomNavLink";
import SynodImage from "../../utility/SynodImage";

const StaticPremiumMembership: React.FC = () => {

    const navigate = useNavigate();


    return (
        <div className="StaticPremiumMembership page-static">
            <PageMetaInformation
                title={'Premium Membership'}
                description={'Support the Trench Companion app and unlock exclusive perks with our premium membership. Enjoy an ad-free experience while helping us improve and expand the platform.'}
            />

            <div className={'container content-narrow'}>
                <h1 className={'mb-2'}>{'Support Trench Companion'}</h1>
                <h2  className={'mb-4'}>{'- Premium Membership'}</h2>

                <StaticParagraph content={
                    <>
                        <strong>
                            {'Trench Companion is a labor of love — built by and for the Trench Crusade community.'}
                        </strong><br/>
                        {'Our Premium Membership exists for one reason: to keep this project alive and growing. It helps cover server costs, fund development time, and lets us focus on creating the tools and features you actually care about. You’ll unlock small perks with your supporter status, but most importantly, you’re making this app possible. No paywalls. No tricks. Just community-powered progress. Thank you. ❤️'}

                        <span className={'d-block spacer-20'} />

                        <CustomNavLink
                            classes={'btn btn-primary'}
                            link={`/page/plan-selection`}
                            runfunc={() => {
                                navigate(`/page/plan-selection`)
                            }}>
                            {'Support the Project'}
                        </CustomNavLink>
                    </>
                }/>


                <StaticImageText1
                    content={
                        <>
                            <h2>
                                {'Affordable Support'}
                            </h2>
                            <h3>
                                {'Only $1.99'}
                            </h3>
                            <p>
                                {"It's a small, recurring monthly contribution — but it makes a big difference. Your support helps us keep the app alive and improving."}

                            </p>
                        </>
                    }

                    imageId={2854}
                />


                <StaticImageText1
                    content={
                        <>
                            <h2>
                                {'Cancel at any time'}
                            </h2>

                            <p>
                                {"We believe in earning your support — not locking you in.  You can cancel your premium membership at any time, no questions asked. You'll continue to enjoy premium benefits until the end of your billing cycle, and you’re always welcome back."}
                            </p>
                        </>
                    }

                    imageId={2756}
                    className={'swap'}
                />

                <StaticImageText1
                    content={
                        <>
                            <h2 className={'mb-1'}>
                                {'Customize your Experience'}
                            </h2>
                            <h3 className={'mb-3'}>
                                {'Coming Soon'}
                            </h3>

                            <p>
                                {"Premium members will be able to personalize their experience by uploading custom images to their warbands and profiles. Showcase your painted miniatures  — and make your creations truly yours. It's your warband, your style."}
                                <br/><br/>
                                {"Only with your support, we will be able to create this feature."}
                            </p>
                        </>
                    }

                    imageId={2888}
                />

                <StaticImageText1
                    content={
                        <>
                            <h2 className={'mb-1'}>
                                {'Additional Benefits'}
                            </h2>
                            <h3 className={'mb-3'}>
                                {'Coming Soon'}
                            </h3>

                            <p>
                                {"As we develop new features for everybody, we don't want to forget about our most saintly supporters. We plan to create excluive and interesting features and benefits for our supporters - inside our app and beyond it. We aim to provide the most value possible for our supporters."}
                            </p>
                        </>
                    }

                    imageId={2856}
                    className={'swap'}
                />

                <StaticImageText1
                    content={
                        <>
                            <h2>
                                {'No Ads, Just Game'}
                            </h2>

                            <p>
                                {'Ads help us cover basic server and maintenance costs – but if you\'re supporting us directly, we’re happy to turn them off entirely for you.'}
                                <br/><br/>
                                {"As a supporter, you'll enjoy a completely ad-free experience. We disable all ads for premium members to keep your interface clean, focused, and immersive — so you can explore, build, and play without distraction."}
                            </p>
                        </>
                    }

                    imageId={38}
                />

                <h2>
                    {'Frequently asked questions'}
                </h2>

                <StaticFaq
                    title={'How do you handle the payment?'}
                    content={
                    <>
                        {'Currently the payment is realized by using PayPal Subscription. '}
                    </>
                    }
                />

                <StaticFaq
                    title={'How can I subscribe?'}
                    content={
                        <>
                            {'You find the subscription options in your profile settings.'}
                        </>
                    }
                />

                <StaticFaq
                    title={'How can I cancel my subscription?'}
                    content={
                    <>
                        {'You can cancel your subscription in your profile settings or by cancelling in your PayPal dashboard.'}
                    </>
                    }
                />

                <StaticFaq
                    title={'What happens to my uploaded images when i cancel my subscription?'}
                    content={
                        <>
                            {'The Images you have uploaded will stay on your profile. You will not be able to upload any new images when you are not subscribed.'}
                        </>
                    }
                />

                <StaticFaq
                    title={'What happens to my customization options, when I cancel my subscription?'}
                    content={
                        <>
                            {'Your Profile status and customization options will be reset to the ones available to free members after your last billing cycle has ended.'}
                        </>
                    }
                />
            </div>
        </div>
    )
}

export default StaticPremiumMembership