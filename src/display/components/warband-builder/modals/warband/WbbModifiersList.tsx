import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { IChoice } from '../../../../../classes/options/StaticOption';
import { SelectedOption } from '../../../../../classes/options/SelectedOption';
import WbbEditViewModifier from '../../WbbEditViewModifier';
import { useWarband } from '../../../../../context/WarbandContext';
import { WarbandProperty } from '../../../../../classes/saveitems/Warband/WarbandProperty';
import WbbEditViewExtraModifier from '../../WbbEditViewExtraModifier';

const WbbModifiersList = () => {
    const { warband, updateKey, reloadDisplay } = useWarband();

    const [keyvar, setkeyvar] = useState(0);
    const [modifiers, setmodifiers] = useState<WarbandProperty[]>([]);
    const [fireteams, setfireteams] = useState<WarbandProperty[]>([]);
    const [locations, setlocations] = useState<WarbandProperty[]>([]);

    useEffect(() => {
        async function RunUpdate() {
            if (warband) {
                const Modifiers = await warband?.warband_data.GetModifiersList();
                const Fireteams = await warband?.warband_data.GetFireteams();
                
                setmodifiers(Modifiers);
                setfireteams(Fireteams)
                setlocations(warband?.warband_data.ModifiersLoc)
                setkeyvar(keyvar + 1);
            }
        }

        RunUpdate()
    }, [updateKey]);

    return (
        <div key={keyvar}>        
            {/* Warband Modifiers */}
            {modifiers.length > 0 &&
                <>
                    <h3 className={'category-headline'} key={keyvar}>Modifiers</h3>
                    {modifiers.map((item) =>
                        <WbbEditViewExtraModifier
                            key={item.GetTrueName()}
                            warbprop={item}
                            index={modifiers.indexOf(item)}
                        />
                    )}
                </>
            } 
            {/* Warband Modifiers */}
            {fireteams.length > 0 &&
                <>
                    <h3 className={'category-headline'}>Fireteams</h3>
                    {fireteams.map((item) =>
                        <WbbEditViewExtraModifier
                            key={item.GetTrueName()}
                            warbprop={item}
                            index={modifiers.indexOf(item)}
                        />
                    )}
                </>
            }
            {/* Warband Modifiers */}
            {locations.length > 0 &&
                <>
                    <h3 className={'category-headline'}>Exploration Choices</h3>
                    {locations.map((item) =>
                        <WbbEditViewExtraModifier
                            key={item.GetTrueName()}
                            warbprop={item}
                            index={modifiers.indexOf(item)}
                        />
                    )}
                </>
            }
            
        </div>
    );
};

export default WbbModifiersList;