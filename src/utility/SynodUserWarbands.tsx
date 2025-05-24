import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {SYNOD} from "../resources/api-constants";

interface Warband {
    warband_id: number;
    title: string;
    content: string;
    warband_data: string;
    warband_user: number;
}

const SynodUserWarbands: React.FC = () => {
    const [warbands, setWarbands] = useState<Warband[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const userId = localStorage.getItem('synodUserId');

    useEffect(() => {
        const fetchWarbands = async () => {
            if (!userId) {
                setError('User not logged in.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${SYNOD.URL}/wp-json/wp/v2/warbands/by-user/${userId}`);
                setWarbands(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch warbands');
            } finally {
                setLoading(false);
            }
        };

        fetchWarbands();
    }, [userId, SYNOD.URL]);

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Your Warbands</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && warbands.length === 0 && <p>No warbands found.</p>}
            <ul>
                {warbands.map((warband) => (
                    <li key={warband.warband_id}>
                        <strong>{warband.title}</strong>
                        <pre>{warband.warband_data}</pre>
                        <pre>
                            <small>User ID: {warband.warband_user}</small><br />
                            <small>Warband ID: {warband.warband_id}</small>
                        </pre>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SynodUserWarbands;
