
/**
 * A Static page for the privacy notice
 */

import React, {useState} from 'react'
import PrivacyPopup from "../components/generics/PrivacyPopup";

const StaticPrivacy: React.FC = () => {

    const [showPopup, setShowPopup] = useState(false);


    return (
        <div className="StaticPrivacy page-static">
            <div className={'container'}>

                <PrivacyPopup forceShow={showPopup}/>

                <h1>
                    {'Privacy Policy for Trench Companion'}
                </h1>

                <p>
                    {
                        'At Trench Companion, accessible at trench-companion.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Trench Companion and how we use it.\n' +
                        'If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us through email at info@trench-companion.com\n' +
                        'This privacy policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Trench Companion. This policy is not applicable to any information collected offline or via channels other than this website.'
                    }
                </p>

                <h2>
                    {'Consent'}
                </h2>

                <p>
                    {
                        'By using our website, you hereby consent to our Privacy Policy and agree to its terms.'
                    }

                    <br/>
                    <div className={'btn btn-secondary btn-sm mt-3 mb-3'} onClick={() => setShowPopup(true)}>
                        {'Change Privacy Settings'}
                    </div>
                </p>

                <h2>
                    {'Information we collect'}
                </h2>

                <p>
                    {
                        'The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.\n' +
                        'If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.\n' +
                        'When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.'
                    }
                </p>

                <h2>
                    {'How we use your information'}
                </h2>

                <p>
                    {
                        'We use the information we collect in various ways, including to:\n' +
                        '\n' +
                        'Provide, operate, and maintain our website\n' +
                        'Improve, personalize, and expand our website\n' +
                        'Understand and analyze how you use our website\n' +
                        'Develop new products, services, features, and functionality\n' +
                        'Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes\n' +
                        'Send you emails'
                    }
                </p>

                <h2>
                    {'Log Files'}
                </h2>

                <p>
                    {
                        'Trench Companion follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services\' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users\' movement on the website, and gathering demographic information.'
                    }
                </p>

                <h2>
                    {'Cookies and Web Beacons'}
                </h2>

                <p>
                    {
                        'Like any other website, Trench Companion uses ‘cookies\'. These cookies are used to store information including visitors\' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users\' experience by customizing our web page content based on visitors\' browser type and/or other information.'
                    }
                </p>

                <h2>
                    {'DoubleClick DART Cookie'}
                </h2>

                <p>
                    {
                        'Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to trench-companion.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – https://policies.google.com/technologies/ads.\n' +
                        'Google\n' +
                        'https://policies.google.com/technologies/ads'
                    }
                </p>

                <h2>
                    {'Advertising Partners Privacy Policies'}
                </h2>

                <p>
                    {
                        'You may consult this list to find the Privacy Policy for each of the advertising partners of Trench Companion.\n' +
                        '\n' +
                        'Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Trench Companion, which are sent directly to users\' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.\n' +
                        '\n' +
                        'Note that Trench Companion has no access to or control over these cookies that are used by third-party advertisers.'
                    }
                </p>

                <h2>
                    {'Third-Party Privacy Policies'}
                </h2>

                <p>
                    {
                        'Trench Companion\'s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options. You may find a complete list of these Privacy Policies and their links here: Privacy Policy Links.\n' +
                        '\n' +
                        'You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers\' respective websites. What Are Cookies?'
                    }
                </p>

                <h2>
                    {'CCPA Privacy Policy (Do Not Sell My Personal Information)'}
                </h2>

                <p>
                    {
                        'Under the CCPA, among other rights, California consumers have the right to:\n' +
                        '\n' +
                        'Request that a business that collects a consumer\'s personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.\n' +
                        '\n' +
                        'Request that a business delete any personal data about the consumer that a business has collected.\n' +
                        '\n' +
                        'Request that a business that sells a consumer\'s personal data, not sell the consumer\'s personal data.\n' +
                        '\n' +
                        'If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.'
                    }
                </p>

                <h2>
                    {'GDPR Privacy Policy (Data Protection Rights)'}
                </h2>

                <p>
                    {
                        'We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:\n' +
                        '\n' +
                        'The right to access – You have the right to request copies of your personal data. We may charge you a small fee for this service.\n' +
                        '\n' +
                        'The right to rectification – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.\n' +
                        '\n' +
                        'The right to erasure – You have the right to request that we erase your personal data, under certain conditions.\n' +
                        '\n' +
                        'The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.\n' +
                        '\n' +
                        'The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.\n' +
                        '\n' +
                        'The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.\n' +
                        '\n' +
                        'If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.'
                    }
                </p>

                <h2>
                    {'Children\'s Information'}
                </h2>

                <p>
                    {
                        'Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.\n' +
                        '\n' +
                        'Trench Companion does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.'
                    }
                </p>
            </div>
        </div>
    )
}

export default StaticPrivacy