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

    useEffect(() => {
        async function RunUpdate() {
            if (warband) {
                const Modifiers = await warband?.warband_data.GetModifiersList();
                setmodifiers(Modifiers);
            }
            setkeyvar(keyvar + 1);
        }

        RunUpdate()
    }, [updateKey]);

    return (
        <div key={keyvar}>        
            {/* Warband Modifiers */}
            <h3 className={'category-headline'}>Modifiers</h3>
            {modifiers.map((item) =>
                <WbbEditViewExtraModifier
                    key={item.GetTrueName()}
                    warbprop={item}
                    index={modifiers.indexOf(item)}
                />
            )}
        </div>
    );
};

export default WbbModifiersList;