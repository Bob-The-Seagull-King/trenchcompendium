/**
 * A Static page that explains and shows off the supporter packs
 */



import React from 'react'
import StaticParagraph from "../static-content/StaticParagraph";
import StaticImageText1 from "../static-content/StaticImageText-1";
import StaticFaq from "../static-content/StaticFaq";

const StaticSupporterPacks: React.FC = () => {
    return (
        <div className="StaticSupporterPacks page-static">
            <div className={'container content-narrow'}>
                <h1>Supporter Packs</h1>

                <StaticParagraph content={
                    <>
                        {'The Supporter Pack is your chance to make a meaningful contribution to the development of Trench Companion. By purchasing a one-time pack for $50, you directly support continued improvements, server costs, and new features — all while keeping the platform ad-free and up to date. The supporter packs are 100% voluntary and we are very grateful for any support we can get.'}
                    </>
                }/>
                <StaticParagraph content={
                    <>
                        {''}
                    </>
                }/>

                <StaticImageText1
                    content={
                        <>
                            <h2>
                                {'What you get'}
                            </h2>
                            <h5>
                                {'When you purchase a supporter pack, you will receive'}
                            </h5>

                            <ul>
                                <li>
                                    {'One year premium membership'}
                                </li>
                                <li>
                                    {'Exclusive UI Skins'}
                                </li>
                                <li>
                                    {'Premium Profile Pictures & Frames'}
                                </li>
                                <li>
                                    {'Recognition & Gratitude'}
                                </li>
                            </ul>
                        </>
                    }
                    imageId={268}
                />

                <StaticImageText1
                    content={
                        <>
                            <h2>
                                {'Why It Matters'}
                            </h2>

                            <p>
                                {"Supporter packs are not about unlocking content — they're about supporting a passion project. Your one-time contribution helps us fund development, test new tools, and keep the app growing in the hands of hobbyists — not advertisers."}
                            </p>
                        </>
                    }
                    imageId={266}
                    className={'swap'}
                />


                <StaticImageText1
                    content={
                        <>
                            <h2>
                                {'Our eternal gratitude'}
                            </h2>

                            <p>
                                {"To show our gratitude we want to offer as many bonus features to our supporters without hiding any content of the app behind a paywall. "}
                                <br/>
                                {"We plan to offer exclusive STL files, UI skins, customization options and promotions to our loyal supporters. Keep in mind, the app is still fresh and in active development - so not all features are present at the moment. Your early support will help us build the best wargaming app."}
                            </p>
                        </>
                    }
                    imageId={267}
                />

                <h2>
                    {'Frequently asked questions'}
                </h2>

                <StaticFaq
                    title={'How do you handle the payment?'}
                    content={
                        <>
                            {'Currently the payment is realized by using PayPal.'}
                        </>
                    }
                />
                <StaticFaq
                    title={'What happens, when the 1-year membership expires?'}
                    content={
                        <>
                            {'Your account will be turned into a free member account after the 1-year membership has expired. However, you will keep all customization options, which you have unlocked with the purchase of the supporter pack.'}
                        </>
                    }
                />
                <StaticFaq
                    title={'How do i regain membership status after the 1-year period?'}
                    content={
                        <>
                            {'You can subscribe to be a to a premium member and regain the paid member status. Alternatively you can purchase another supporter pack for another 1-year membership. As we plan to release more and more meaningful content and goodies for our most loyal supporters, this will be worth looking into.'}
                        </>
                    }
                />
                <StaticFaq
                    title={'What happens when new goodies are released for my supporter pack?'}
                    content={
                        <>
                            {"Any new content for supporter packs will be available to you in the future, if you purchased a supporter pack in the past. As we are still in early development, we do not want to make any promises, we can't keep, but assure you, that we plan to release many interesting benefits for our supporters."}
                        </>
                    }
                />

            </div>
        </div>
    )
}

export default StaticSupporterPacks