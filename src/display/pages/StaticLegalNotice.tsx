/**
 * A Static page for the legal notice
 */

import React from 'react'
import PageMetaInformation from "../components/generics/PageMetaInformation";

const StaticLegalNotice: React.FC = () => {
    return (
        <div className="StaticLegalNotice page-static">
            <div className={'container'}>
                <PageMetaInformation
                    title={'Legal Notice'}
                    description={'Trench Companion legal notice'}
                />

                <h1>Legal Notice</h1>

                <h2>Website Operator</h2>
                <p>
                    David Leusch<br/>
                    Momentum Digital<br/>
                    Zeppelinstr. 5b<br/>
                    48147 Münster<br/>
                    Germany
                </p>

                <h2>Represented by</h2>
                <p>Lane Edwards-Brown (Managing Director)</p>
                <p>David Leusch (Managing Director)</p>

                <h2>Contact Information</h2>
                <p>
                    Phone: +49 251 931 33551<br/>
                    Email: info@trench-companion.com
                </p>

                <h2>VAT Identification Number</h2>
                <p>
                    VAT ID according to § 27 a of the German VAT Act (UStG):<br/>
                    DE344283265
                </p>

                <h2>Register Information</h2>
                <p>
                    Company Register: Amtsgericht Münster<br/>
                </p>

                <h2>Disclaimer</h2>
                <p>
                    The content on this website has been created with the utmost care. However, we do not guarantee the accuracy, completeness, or timeliness of the content. As a service provider, we are responsible for our own content in accordance with general laws.
                    We are not obligated to monitor transmitted or stored third-party information or investigate circumstances that indicate illegal activity.
                </p>

                <h2>Liability for Links</h2>
                <p>
                    Our website contains links to external websites over which we have no control. Therefore, we cannot assume any responsibility for their content. The respective provider or operator of the linked pages is always responsible for their content.
                </p>

                <h2>Copyright</h2>
                <p>
                    The content and works on this website created by the website operator are subject to copyright law. Reproduction, modification, distribution, or any form of commercialization of such material beyond the scope of the copyright law requires prior written consent of the respective author or creator.
                </p>

            </div>
        </div>
    )
}

export default StaticLegalNotice