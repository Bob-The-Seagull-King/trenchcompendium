import React, {useState} from 'react';
import {Button, Modal, OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faEllipsisVertical, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useWarband} from "../../../context/WarbandContext";
import WbbContextualPopover from "./WbbContextualPopover";
import { WarbandProperty } from '../../../classes/saveitems/Warband/WarbandProperty';
import { returnDescription } from '../../../utility/util';
import WbbOptionSelect from './modals/warband/WbbOptionSelect';
import { usePlayMode } from '../../../context/PlayModeContext';

interface WbbEditViewModifierProps {
    warbprop: WarbandProperty;
    index : number
    isinner?: boolean;
}

const WbbEditViewModifier: React.FC<WbbEditViewModifierProps> = ({ warbprop, index, isinner }) => {

    const { warband, updateKey } = useWarband();
    if (warband == null) return (<div>Loading...</div>);
    const { playMode } = usePlayMode();

    return (
        <div className={`WbbEditViewModifier ${isinner != undefined ? 'inner' : ''}`}
             key={updateKey}>
            <div className={'modifier-title'}>
                <span className={'title-name'}>
                    {warbprop.GetTrueName()}
                </span>
            </div>

            {warbprop.SelfDynamicProperty.Selections.length > 0 &&
                <span className={'title-choice'}>
                    {warbprop.SelfDynamicProperty.Selections.map((item) =>
                        <WbbOptionSelect
                            property={warbprop}
                            key={warbprop.SelfDynamicProperty.Selections.indexOf(item)}
                            choice={item}
                        />
                    )}
                </span>
            }

            <div className={'modifier-body'}>
                
                {(warbprop.GetOwnDescription() != null) &&
                <>
                    {
                        returnDescription(warbprop, warbprop.GetOwnDescription())
                    }
                </>
                }
            </div>
        </div>
    );
};

export default WbbEditViewModifier;