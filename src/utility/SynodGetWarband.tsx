import { useEffect, useState } from 'react';

interface SynodImageURLProps {
    WarbandId: number;
}


/**
 * This gets an image url from the synod by its Post ID
 *
 * @param imageId
 * @param size
 */
const SynodGetWarband = ({ WarbandId }: SynodImageURLProps): string => {

    const [warbandData, setWarbandData] = useState('');


    useEffect(() => {

        // const synodUrl = 'http://synod.trench-companion.test/'; // this is for local dev
        const synodUrl = 'https://synod.trench-companion.com/'; // This is for prod

        fetch(`${synodUrl}wp-json/wp/v2/warband/${WarbandId}`)
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