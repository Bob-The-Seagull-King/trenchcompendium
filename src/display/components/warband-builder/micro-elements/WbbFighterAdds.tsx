import React, {useState} from 'react';
import {useWarband} from "../../../../context/WarbandContext";
import { FactionModelRelationship } from '../../../../classes/relationship/faction/FactionModelRelationship';
import WbbModalAddFighterElite from '../modals/WbbModalAddFighterElite';
import WbbModalAddFighterMercenary from '../modals/WbbModalAddFighterMercenary';
import WbbModalAddFighterTroop from '../modals/WbbModalAddFighterTroop';
import { ToolsController } from '../../../../classes/_high_level_controllers/ToolsController';


interface WbbModalAddFighterEliteProps {
    showAddFighterEliteModal: boolean;
    showAddFighterTroopModal: boolean;
    showAddFighterMercenaryModal: boolean;
    onCloseTroop: () => void;
    onCloseElite: () => void;
    onCloseMercenary: () => void;
}

const WbbFighterAdds : React.FC<WbbModalAddFighterEliteProps> = ({
                                                                     showAddFighterEliteModal,
                                                                     showAddFighterTroopModal,
                                                                     showAddFighterMercenaryModal,
                                                                     onCloseTroop,
                                                                     onCloseElite,
                                                                     onCloseMercenary
}) => {

    const { warband, updateKey, reloadDisplay } = useWarband();

    const handleFighterSubmit = (newFighter: FactionModelRelationship[]) => {
        if (!warband) { return; } // Guard

        warband.warband_data.AddFighter(newFighter).then(() => {
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                () => reloadDisplay())
        }
        );
    };
    return (
        <>
            <WbbModalAddFighterTroop
                show={showAddFighterTroopModal}
                onClose={() => onCloseTroop()}
                onSubmit={handleFighterSubmit}
            />

            <WbbModalAddFighterElite
                show={showAddFighterEliteModal}
                onClose={() => onCloseElite()}
                onSubmit={handleFighterSubmit}
            />

            <WbbModalAddFighterMercenary
                show={showAddFighterMercenaryModal}
                onClose={() => onCloseMercenary()}
                onSubmit={handleFighterSubmit}
            />
        </>
    )
};

export default WbbFighterAdds;