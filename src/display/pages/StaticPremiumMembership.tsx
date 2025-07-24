/**
 * A Static page to promote and explain the paid membership
 */


import React from 'react'
import StaticParagraph from "../static-content/StaticParagraph";
import StaticImageText1 from "../static-content/StaticImageText-1";
import StaticFaq from "../static-content/StaticFaq";

const StaticPremiumMembership: React.FC = () => {
    return (
        <div className="StaticPremiumMembership page-static">
            <div className={'container content-narrow'}>
                <h1>{'Premium Membership'}</h1>

                <StaticParagraph content={
                    <>
                        {'Our premium membership is the best way to support the ongoing development of this app. By subscribing, you help us improve features, release updates faster, and keep the platform sustainable — all while unlocking exclusive perks and removing all ads along the way. We aim to provide all content for free - your support is completely voluntary. Thank you for supporting independent development! ❤️'}
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

                    imageId={262}
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

                    imageId={263}
                    className={'swap'}
                />

                <StaticImageText1
                    content={
                        <>
                            <h2>
                                {'Upload Your Own Images'}
                            </h2>
                            <h3>
                                {'Coming Soon'}
                            </h3>

                            <p>
                                {"Premium members will be able to personalize their experience by uploading custom images to their warbands and profiles. Showcase your painted miniatures  — and make your creations truly yours. It's your warband, your style."}
                                <br/><br/>
                                {"Only with your support, we will be able to create this feature."}
                            </p>
                        </>
                    }

                    imageId={264}
                />

                <StaticImageText1
                    content={
                        <>
                            <h2>
                                {'Premium Visual Customization'}
                            </h2>
                            <h3>
                                {'Coming Soon'}
                            </h3>

                            <p>
                                {"As a premium member, you will be able to get access to exclusive UI skins and profile picture options. Match your interface to your favorite faction, theme, or personal aesthetic — and stand out with a unique visual style across the app."}
                            </p>
                        </>
                    }

                    imageId={265}
                    className={'swap'}

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
                            {'Your Profile status and customization options will be reset to the ones available to free members.'}
                        </>
                    }
                />
            </div>


        </div>
    )
}

export default StaticPremiumMembership