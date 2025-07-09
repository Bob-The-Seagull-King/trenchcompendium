import React, {useEffect, useState} from 'react';
import {useWarband} from "../../../../context/WarbandContext";
import { WarbandAlert } from '../../../../classes/saveitems/Warband/UserWarband';


const WbbAlertsBox = () => {

    const { warband, updateKey } = useWarband();
    
    if (warband == null) return (<div></div>);
    const [keyvar, setkeyvar] = useState(0);
    const [alerts, setalerts] = useState<WarbandAlert[]>([]);
    
    useEffect(() => {
        async function GetAlerts() {
            const alertlist = await warband?.warband_data.GetWarbandAlerts();
            if (alertlist != undefined) {
                setalerts(alertlist)
                setkeyvar(keyvar + 1);
            }
        }
        GetAlerts();
    }, [updateKey]);

    return (
        <h1 key={keyvar}>
            {alerts.map((alert) => 
            <>
                {alert.title}
                {alert.content}
            </>)}
        </h1>
    );
};

export default WbbAlertsBox;