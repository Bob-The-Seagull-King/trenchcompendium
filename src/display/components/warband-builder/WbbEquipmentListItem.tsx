import React from 'react';
import {Button, Modal, OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faArrowUp,
    faCoins,
    faCopy,
    faEllipsisVertical,
    faTrash,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import WbbContextualPopover from "./WbbContextualPopover";
import {usePlayMode} from "../../../context/PlayModeContext";

interface EquipmentItemProps {
    item: {
        Name: string;
        CostDucats: number;
        CostGlory: number;
        ModifiersString?: string;
        Id: string;
        Range?: string;
        Type?: string;
        Rules?: string;
        Keywords?: string;
        Modifiers?: string;
    };
}

const WbbEquipmentListItem: React.FC<EquipmentItemProps> = ({ item }) => {

    const { playMode } = usePlayMode();

    return (
        <div className={`WbbEquipmentListItem ${playMode ? 'play-mode' : ''}`}>
            <div className="equipment-name">{item.Name}</div>

            {!playMode &&
                <div className="equipment-cost">
                    {item.CostDucats > 0 &&
                        <>
                            {item.CostDucats + " Ducats"}
                        </>
                    }
                    {item.CostGlory > 0 &&
                        <>
                            {item.CostGlory + "  Glory"}
                        </>
                    }
                </div>
            }

            {!playMode &&
                <div className={'equipment-modifiers'}>
                    {item.ModifiersString}
                </div>
            }

            {!playMode &&
                <WbbContextualPopover
                    id={`equipment-${item.Id}`}
                    type="equipment"
                    item={item}
                />
            }

            {playMode &&
                <div className={'equipment-details'}>
                    <table>
                        { item.Range &&
                            <tr>
                                <td>
                                    Range
                                </td>
                                <td>
                                    {item.Range}
                                </td>
                            </tr>
                        }
                        { item.Type &&
                            <tr>
                                <td>
                                    Type
                                </td>
                                <td>
                                    {item.Type}
                                </td>
                            </tr>
                        }
                        { item.Modifiers &&
                            <tr>
                                <td>
                                    Modifiers
                                </td>
                                <td>
                                    {item.Modifiers}
                                </td>
                            </tr>
                        }
                    </table>
                    { item.Keywords &&
                        <div className={'keywords-wrap'}>
                            <div className={'text-label'}>
                                {'Keywords'}
                            </div>
                            <div className={'keywords'}>
                                {item.Keywords}
                            </div>
                        </div>
                    }
                    { item.Rules &&
                        <div className={'rules-wrap'}>
                            <div className={'text-label'}>
                                {'Rules'}
                            </div>
                            <div className={'rules'}>
                                {item.Rules}
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    );
};

export default WbbEquipmentListItem;
