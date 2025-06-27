import { useEffect, useRef } from "react";
import axios from "axios";
import {SYNOD} from "../../../resources/api-constants";


declare const window: Window &
    typeof globalThis & {
    paypal?: any;
};

const PayPalSubButton = ({
                             onSuccess,
                             planId,
                         }: {
    onSuccess?: (subscriptionID: string) => void;
    planId: string;
}) => {
    const paypalRef = useRef<HTMLDivElement>(null);

    const hasRenderedRef = useRef(false); // âœ… Track if already rendered
    const scriptId = "paypal-js-sdk";

    useEffect(() => {
        async function handleApproval(subscriptionID: string, planID: string) {
            console.log("Handling approval internally: ", subscriptionID);

            // Create sub in the API
            const authToken = localStorage.getItem('jwtToken')

            try {
                const response = await axios.post(`${SYNOD.URL}/wp-json/synod-payment/v1/create-subscription`, {
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
            if (hasRenderedRef.current || !paypalRef.current) return;


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

            hasRenderedRef.current = true; // ✅ Mark as rendered
        }

        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.src = `https://www.paypal.com/sdk/js?client-id=${SYNOD.PP_CLIENT_ID}&vault=true&intent=subscription`;
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