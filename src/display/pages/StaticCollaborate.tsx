/**
 * A Static page to explain ways to collaborate
 */


import React from 'react'
import StaticParagraph from "../static-content/StaticParagraph";
import StaticImageText1 from "../static-content/StaticImageText-1";
import StaticFaq from "../static-content/StaticFaq";

const StaticCollaborate: React.FC = () => {
    return (
        <div className="StaticCollaborate page-static">
            <div className={'container content-narrow'}>

                <h1>Collaboration</h1>

                <StaticParagraph content={
                    <>
                        {"We’re building a strong creative community around the world of Trench Crusade — and we’re looking for passionate collaborators to join us. Whether you're a 3D sculptor, miniature painter, or a hobby accessory manufacturer, we want to work with you to bring unique content, art, and tools to our players. Let’s create something incredible together."}
                    </>
                }/>

                <StaticImageText1
                    content={
                        <>
                            <h2>
                                {'3D Sculptors'}
                            </h2>
                            <p>
                                {"You are a 3D sculptor? We would love to work with you! We offer redeemable codes for our premium membership, which you can offer to your patreons or tribe members as an additional goodie. "}
                                <br/>
                                {"Additionally, we would like to offer exclusive sculpts to our supporters. Maybe you are interested in working on a very special release to promote your work and get involved in the Trench Companion Community."}
                            </p>
                        </>
                    }

                    imageId={270}
                />

                <StaticImageText1
                    content={
                        <>
                            <h2>
                                {'Miniature Painters'}
                            </h2>
                            <p>
                                {"You might have notived, that the images for models in our app are all painted by talented members of the Trench Crusade community. If you would like your models to be featured in Trench Companion, don't hesitate to contact us."}
                            </p>
                        </>
                    }
                    imageId={269}
                    className={'swap'}
                />

                <StaticImageText1
                    content={
                        <>
                            <h2>
                                {'Manufacturers'}
                            </h2>
                            <p>
                                {"Do you have a product that is compatible with or even specifically made for Trench Crusade? It would be a pleasure for us to promote awesome products on our page and maybe even collaborate on a project with you. No matter if you are selling dice, transport solutions, terrain, accessories or something more unique - we are very interested in what you have to offer."}
                            </p>
                        </>
                    }
                    imageId={271}
                />

                <h2>
                    {'Frequently asked questions'}
                </h2>

                <StaticFaq
                    title={'How do I contact you?'}
                    content={
                        <>
                            {'You can simply write your inquiry at info@trench-companion.com'}
                        </>
                    }
                />

                <StaticFaq
                    title={'How do I get my paintjob featured in Trench Companion?'}
                    content={
                        <>
                            {'Please contact us via email and submit an example of your work. We are not looking for the very best paint jobs in the world and are happy about any submitted content.'}
                        </>
                    }
                />


                <StaticFaq
                    title={'How is my work credited?'}
                    content={
                        <>
                        {"We will put your name and a link to your work near the image. Wherever a community image is used, users can clearly see your name."}
                        </>
                    }
                />

            </div>
        </div>
    )
}

export default StaticCollaborate