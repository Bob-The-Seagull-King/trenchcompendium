import { useEffect, useState } from 'react';
import {SYNOD} from "../resources/api-constants";

interface SynodWarbandURLProps {
    WarbandId: number;
}


/**
 * This gets a warband from the synod by its Post ID
 *
 * @param WarbandId
 */
const SynodGetWarband = ({ WarbandId }: SynodWarbandURLProps): string => {

    const [warbandData, setWarbandData] = useState('');


    useEffect(() => {


        fetch(`${SYNOD.URL}/wp-json/wp/v2/warband/${WarbandId}`)
            .then(res => res.json())
            .then(data => {

                const warbandData = data.meta?.warband_data;

                setWarbandData(warbandData);

            })
            .catch(console.error);
    }, []);

    return warbandData;
};

export default SynodGetWarband;