import React, {useState} from 'react';
import {useWarband} from "../../../../context/WarbandContext";
import { FactionModelRelationship } from '../../../../classes/relationship/faction/FactionModelRelationship';
import WbbModalAddFighterElite from '../modals/WbbModalAddFighterElite';
import WbbModalAddFighterMercenary from '../modals/WbbModalAddFighterMercenary';
import WbbModalAddFighterTroop from '../modals/WbbModalAddFighterTroop';
import { ToolsController } from '../../../../classes/_high_level_controllers/ToolsController';
import WbbModalAddFighterCustom from '../modals/WbbModalAddFighterCustom';
import { Model } from '../../../../classes/feature/model/Model';


interface WbbModalAddFighterEliteProps {
    showAddFighterEliteModal: boolean;
    showAddFighterTroopModal: boolean;
    showAddFighterMercenaryModal: boolean;
    showAddFighterCustomModal: boolean;
    onCloseTroop: () => void;
    onCloseElite: () => void;
    onCloseMercenary: () => void;
    onCloseCustom: () => void;
}

const WbbFighterAdds : React.FC<WbbModalAddFighterEliteProps> = ({
                                                                     showAddFighterEliteModal,
                                                                     showAddFighterTroopModal,
                                                                     showAddFighterMercenaryModal,
                                                                     showAddFighterCustomModal,
                                                                     onCloseTroop,
                                                                     onCloseElite,
                                                                     onCloseMercenary,
                                                                     onCloseCustom
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

    const handleCustomFighterSubmit = (newFighter : Model, cost : number, costtype : number) => {
        if (!warband) { return; } // Guard

        warband.warband_data.AddCustomFighter(newFighter, cost, costtype).then(() => {
            const Manager : ToolsController = ToolsController.getInstance();
            Manager.UserWarbandManager.UpdateItemInfo(warband? warband.id : -999).then(
                () => reloadDisplay())
        });

    }
    return (
        <>
        {showAddFighterTroopModal &&
            <WbbModalAddFighterTroop
                show={showAddFighterTroopModal}
                onClose={() => onCloseTroop()}
                onSubmit={handleFighterSubmit}
            />
        }
        {showAddFighterEliteModal &&
            <WbbModalAddFighterElite
                show={showAddFighterEliteModal}
                onClose={() => onCloseElite()}
                onSubmit={handleFighterSubmit}
            />
        }
        
        {showAddFighterMercenaryModal &&
            <WbbModalAddFighterMercenary
                show={showAddFighterMercenaryModal}
                onClose={() => onCloseMercenary()}
                onSubmit={handleFighterSubmit}
            />
        }
        
        {showAddFighterCustomModal &&
            <WbbModalAddFighterCustom
                show={showAddFighterCustomModal}
                onClose={() => onCloseCustom()}
                onSubmit={handleCustomFighterSubmit}
            />
        }
        </>
    )
};

export default WbbFighterAdds;