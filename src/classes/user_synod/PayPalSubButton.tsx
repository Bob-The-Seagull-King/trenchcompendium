import { useEffect, useRef } from "react";

declare const window: Window & typeof globalThis & {
    paypal?: any;
};

const PayPalSubButton = ( { onSuccess }: { onSuccess?: (subscriptionID: string) => void }) => {
    const paypalRef = useRef<HTMLDivElement>(null);
    const planId = 'P-4YK72240DG152144TNBN7EKI'; // TC Plus 1 Month
    const clientId = 'AREbTEkX_IfbYs5fjuz54_aCppkKrZi_lWfZXIGWt4DSw_gwF9zfQ40gLB8SeUU5yNrehIgeeIG5uuED';

    useEffect(() => {
        const scriptId = 'paypal-js-sdk';

        // Internal handler
        const handleApproval = (subscriptionID: string) => {
            console.log('Handling approval internally: ', subscriptionID);

            // external callback
            if (onSuccess) {
                onSuccess(subscriptionID);
            }
        };

        // Only load PayPal SDK if not already loaded
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}_ID&vault=true&intent=subscription`;
            script.id = scriptId;
            script.addEventListener('load', () => renderButton());
            document.body.appendChild(script);
        } else {
            renderButton();
        }

        function renderButton() {
            if (!window.paypal) return;

            window.paypal.Buttons({
                createSubscription: function (data: any, actions: any) {
                    return actions.subscription.create({
                        plan_id: planId,
                    });
                },
                onApprove: function (data: any) {
                    console.log('Subscription approved:', data);
                    handleApproval(data.subscriptionID); // handler
                },
                onError: function (err: any) {
                    console.error('PayPal error:', err);
                }
            }).render(paypalRef.current);
        }
    }, [planId, onSuccess]);


    return (
        <div ref={paypalRef} />
    );
};

export default PayPalSubButton;