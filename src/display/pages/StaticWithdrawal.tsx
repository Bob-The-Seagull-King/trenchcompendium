/**
 * A Static page for the withdrawal terms
 */

import React from 'react'
import {ROUTES} from "../../resources/routes-constants";

const StaticWithdrawal: React.FC = () => {
    return (
        <div className="StaticWithdrawal page-static">
            <div className={'container'}>
                <h1>Right of Withdrawal</h1>

                <h2>1. Withdrawal Policy</h2>
                <p>
                    If you are a consumer residing in the European Union and you purchase a paid supporter membership (or any other paid subscription) on this website, you have the right to withdraw from that contract within 14 days without giving any reason.
                </p>

                <p>
                    The withdrawal period will expire 14 days after the day of the conclusion of the contract.
                </p>

                <h2>2. How to Withdraw</h2>
                <p>
                    To exercise the right of withdrawal, you must inform us (see <a href={ROUTES.PAGE_LEGAL}>Legal Notice</a> for contact details) of your decision to withdraw from this contract by a clear statement (e.g. a letter sent by post or email).
                </p>

                <p>
                    You may use the sample withdrawal form provided below, but it is not mandatory.
                </p>

                <h2>3. Effects of Withdrawal</h2>
                <p>
                    If you withdraw from this contract, we will reimburse all payments received from you without undue delay and no later than 14 days from the day on which we are informed of your decision to withdraw. Refunds will be made using the same payment method you used for the original transaction unless otherwise agreed.
                </p>

                <h2>4. Premature Expiry of Withdrawal Right</h2>
                <p>
                    Your right of withdrawal expires prematurely if:
                </p>
                <ul>
                    <li>
                        The performance of the contract has begun with your prior express consent, and
                    </li>
                    <li>
                        You acknowledged that you lose your right of withdrawal once the service has been fully performed or started.
                    </li>
                </ul>

                <h2>5. Sample Withdrawal Form</h2>
                <p>If you wish to withdraw from the contract, you can use the following form:</p>

                <pre style={{ whiteSpace: 'pre-wrap' }}>
                    {`To:
[Your Company Name]
[Address]
[Email Address]

I hereby withdraw from the contract I concluded for the provision of the following service:

Ordered on: ________________
Name: ______________________
Address: ___________________
Signature (if by post): ________
Date: _______________________`}
                  </pre>



            </div>
        </div>
    )
}

export default StaticWithdrawal