import React, {useState} from 'react';
import {useWarband} from "../../../../context/WarbandContext";


const WbbTitle = () => {

    const { warband, updateKey } = useWarband();
    if (warband == null) return (<div>Loading...</div>);

    return (
        <h1 key={updateKey}>
            {warband.warband_data.GetWarbandName()}
        </h1>
    );
};

export default WbbTitle;