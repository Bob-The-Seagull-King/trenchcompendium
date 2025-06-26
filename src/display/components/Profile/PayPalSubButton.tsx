import { useEffect, useRef } from "react";
import axios from "axios";
import {SYNOD} from "../../../resources/api-constants";


declare const window: Window &
    typeof globalThis & {
    paypal?: any;
};

const PayPalSubButton = ({
                             onSuccess,
                         }: {
    onSuccess?: (subscriptionID: string) => void;
}) => {
    const paypalRef = useRef<HTMLDivElement>(null);
    const planId = "P-4YK72240DG152144TNBN7EKI"; // Your PayPal Plan ID
    const clientId =
        "AREbTEkX_IfbYs5fjuz54_aCppkKrZi_lWfZXIGWt4DSw_gwF9zfQ40gLB8SeUU5yNrehIgeeIG5uuED"; // Your Sandbox Client ID

    useEffect(() => {
        const scriptId = "paypal-js-sdk";

        async function handleApproval(subscriptionID: string, planID: string) {
            console.log("Handling approval internally: ", subscriptionID);

            // Create sub in the API
            const authToken = localStorage.getItem('jwtToken')

            try {
                const response = await axios.post(`${SYNOD.URL}/wp-json/synod-payment/v1/create-subscription`, {
                    title: 'Subscription started at ' + new Date().toLocaleString(),
                    status: 'publish',
                    meta: {
                        paypal_subscription_id: subscriptionID,
                        paypal_plan_id: planID
                    }
                }, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    }
                });

                console.log('Subscription created successfully!', response.data.id);
            } catch (err: any) {
                console.error('Error creating subscription:', err.response?.data?.message);
            }

            // outside callback function
            if (onSuccess) {
                onSuccess(subscriptionID);
            }
        }

        function renderButton() {
            if (!window.paypal || !paypalRef.current) return;

            window.paypal
                .Buttons({
                    createSubscription: function (data: any, actions: any) {
                        return actions.subscription.create({
                            plan_id: planId,
                            application_context: {
                                shipping_preference: "GET_FROM_FILE",
                            },
                        });
                    },
                    onApprove: function (data: any) {
                        console.log("Subscription approved:", data);
                        handleApproval(data.subscriptionID, planId);
                    },
                    onError: function (err: any) {
                        console.error("PayPal error:", err);
                    },
                })
                .render(paypalRef.current);
        }

        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription`;
            script.id = scriptId;
            script.addEventListener("load", renderButton);
            document.body.appendChild(script);
        } else {
            renderButton();
        }
    }, [planId, onSuccess]);

    return <div ref={paypalRef} />;
};

export default PayPalSubButton;