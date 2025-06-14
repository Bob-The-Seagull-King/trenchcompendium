import React, {useState} from 'react';
import {useWarband} from "../../../../context/WarbandContext";
import { FactionModelRelationship } from '../../../../classes/relationship/faction/FactionModelRelationship';
import WbbModalAddFighterElite from '../modals/WbbModalAddFighterElite';
import WbbModalAddFighterMercenary from '../modals/WbbModalAddFighterMercenary';
import WbbModalAddFighterTroop from '../modals/WbbModalAddFighterTroop';
import { ToolsController } from '../../../../classes/_high_level_controllers/ToolsController';


interface WbbModalAddFighterEliteProps {
    showelite: boolean;
    showtroop: boolean;
    showmercenary: boolean;
    onCloseTroop: () => void;
    onCloseElite: () => void;
    onCloseMercenary: () => void;
}

const WbbFighterAdds : React.FC<WbbModalAddFighterEliteProps> = ({ showelite, showtroop, showmercenary, onCloseTroop, onCloseElite, onCloseMercenary }) => {

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
                show={showtroop}
                onClose={() => onCloseTroop()}
                onSubmit={handleFighterSubmit}
            />
            <WbbModalAddFighterElite
                show={showelite}
                onClose={() => onCloseElite()}
                onSubmit={handleFighterSubmit}
            />
            <WbbModalAddFighterMercenary
                show={showmercenary}
                onClose={() => onCloseMercenary()}
                onSubmit={handleFighterSubmit}
            />
        </>
    )
};

export default WbbFighterAdds;