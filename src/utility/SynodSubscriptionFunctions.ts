import axios from 'axios';
import { SYNOD } from '../resources/api-constants';

export async function synodCancelSubscription(subscriptionId: string) {
    const token = localStorage.getItem('jwtToken');

    try {
        const res = await axios.post(
            `${SYNOD.URL}/wp-json/synod-payment/v1/cancel-subscription`,
            {
                subscription_id: subscriptionId,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Cancelled:', res.data);
        return res.data;
    } catch (err: any) {
        console.error('Error cancelling subscription:', err.response?.data || err.message);
        throw err;
    }
}