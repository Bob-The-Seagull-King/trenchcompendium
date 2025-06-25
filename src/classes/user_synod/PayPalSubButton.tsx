import { useEffect, useRef } from "react";


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

        const handleApproval = (subscriptionID: string) => {
            console.log("Handling approval internally: ", subscriptionID);
            if (onSuccess) {
                onSuccess(subscriptionID);
            }
        };

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
                        handleApproval(data.subscriptionID);
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