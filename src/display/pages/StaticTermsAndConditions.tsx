/**
 * A Static page for the terms and conditions
 */

import React from 'react'
import {ROUTES} from "../../resources/routes-constants";

const StaticTermsAndConditions: React.FC = () => {
    return (
        <div className="StaticTermsAndConditions page-static">
            <div className={'container'}>
                <h1>Terms and Conditions</h1>

                <h2>1. Introduction</h2>
                <p>
                    Welcome to our platform. These Terms and Conditions (&quot;Terms&quot;) govern your use of this website and any associated services. By accessing or using the platform, you agree to be bound by these Terms. If you do not agree, you may not use this website.
                </p>

                <h2>2. Operator Information</h2>
                <p>
                    This website is operated by Momentum Digital, David Leusch, as detailed in the <a href={ROUTES.PAGE_LEGAL}>Legal Notice</a> page.
                </p>

                <h2>3. Eligibility</h2>
                <p>
                    You must be at least 16 years of age to use this platform. By using the website, you confirm that you meet this requirement.
                </p>

                <h2>4. Account Registration and Use</h2>
                <p>
                    Some features may require you to register an account. You are responsible for maintaining the confidentiality of your login credentials. We reserve the right to suspend or terminate accounts at our discretion, particularly in the event of misuse or violation of these Terms.
                </p>

                <h2>5. Supporter Subscriptions</h2>
                <p>
                    We may offer optional paid supporter memberships that grant additional features or content. Details of each plan, including duration and pricing, will be clearly indicated before purchase. Payments are processed via secure third-party providers.
                </p>
                <p>
                    Unless otherwise stated, subscriptions renew automatically. You may cancel at any time, effective at the end of the billing cycle.
                </p>

                <h3>Right of Withdrawal (EU Residents)</h3>
                <p>
                    If you are a consumer residing in the European Union, you have a 14-day right of withdrawal for digital purchases unless you expressly waive this right by choosing to access the content immediately. We may require this confirmation during checkout.
                </p>

                <h2>6. User Conduct</h2>
                <p>
                    You agree not to:
                </p>
                <ul>
                    <li>Use the platform for illegal or unauthorized purposes</li>
                    <li>Infringe on intellectual property rights</li>
                    <li>Transmit harmful code or engage in disruptive behavior</li>
                    <li>Harass, abuse, or threaten other users</li>
                </ul>

                <h2>7. Intellectual Property</h2>
                <p>
                    All content, branding, and code on this site are the property of the operator or its licensors. You may not reproduce, modify, or redistribute any part of this website without express written permission.
                </p>

                <h2>8. Limitation of Liability</h2>
                <p>
                    This website is provided &quot;as is&quot; without any warranties. We are not liable for damages resulting from the use or inability to use the platform, including service interruptions or data loss.
                </p>

                <h2>9. External Links</h2>
                <p>
                    Our platform may contain links to external websites. We have no control over their content and accept no responsibility for them.
                </p>

                <h2>10. Modifications to These Terms</h2>
                <p>
                    We reserve the right to update or modify these Terms at any time. The current version will always be available on this page. Continued use of the platform constitutes acceptance of the revised Terms.
                </p>

                <h2>11. Governing Law</h2>
                <p>
                    These Terms are governed by the laws of the Federal Republic of Germany, unless local consumer protection laws in your country take precedence. Any disputes shall be subject to the jurisdiction of the courts in [your city], Germany.
                </p>

                <h2>12. Contact</h2>
                <p>
                    For questions about these Terms, please contact us via the details provided in the <a href={ROUTES.PAGE_LEGAL}>Legal Notice</a>.
                </p>

            </div>
        </div>
    )
}

export default StaticTermsAndConditions