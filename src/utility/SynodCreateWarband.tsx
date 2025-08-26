import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import {SYNOD} from "../resources/api-constants";


const SynodCreateWarband: React.FC = () => {
    const [warbandData, setWarbandData] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const { authToken, userId, isLoggedIn } = useAuth();

    const handleCreate = async () => {
        setError('');
        setMessage('');

        let parsedData;
        try {
            parsedData = JSON.parse(warbandData);
        } catch (err) {
            setError('Invalid JSON format.');
            return;
        }

        try {
            const response = await axios.post(`${SYNOD.URL}/wp-json/synod/v1/warband/create`, {
                title: 'Warband created at ' + new Date().toLocaleString(),
                status: 'publish',
                meta: {
                    warband_data: JSON.stringify(parsedData),
                }
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                }
            });

            setMessage(`Warband created successfully! ID: ${response.data.id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error creating warband.');
        }
    };

    return (
        <div>
            <h2>Create New Warband</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            <textarea
                rows={5}
                cols={40}
                value={warbandData}
                onChange={(e) => setWarbandData(e.target.value)}
                placeholder='Paste JSON data for warband_data here'
            />
            <br />
            <button onClick={handleCreate}>Create Warband</button>
        </div>
    );
};

export default SynodCreateWarband;