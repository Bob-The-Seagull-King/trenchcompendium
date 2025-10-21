import {useCampaign} from "../../../context/CampaignContext";
import SynodImageWithCredit from "../../../utility/SynodImageWithCredits";
import React from "react";
import {useNavigate} from "react-router-dom";
import CustomNavLink from "../../components/subcomponents/interactables/CustomNavLink";
import CMPlayerSmall from "./CMPlayerSmall";
import {CampaignWarband} from "../../../classes/saveitems/Campaign/CampaignWarband";


interface CMHistoryGameProps {
    game: {
        date: string;
        warbands: CampaignWarband[];
    }
}

/**
 * A Game History Element
 */
const CMHistoryGame: React.FC<CMHistoryGameProps> = (game) => {
    const { campaign } = useCampaign();
    const navigate = useNavigate();

    return (
        <div className="CMHistoryGame">
            <div className={'CMHistoryGame-Game'}>
                <div className={'CMHistoryGame-Game-main'}> {/* @TODO: make this a link to the game */}
                    {Array.from({ length: Math.ceil(game.game.warbands.length / 2) }, (_, i) => {
                        const pair = game.game.warbands.slice(i * 2, i * 2 + 2);
                        const isIncompleteRow = pair.length < 2;

                        return (
                            <div className={`CMHistoryGame-Game-row ${isIncompleteRow ? "incomplete-row" : ""}`} key={i}>
                                {game.game.warbands.slice(i * 2, i * 2 + 2).map((warband, index) => (
                                    <div className={`CMHistoryGame-Game-warband ${index % 2 === 0 ? "left" : "right"}`}
                                         key={index}
                                    >
                                        <SynodImageWithCredit
                                            imageId={warband.ImageId || 0}
                                            className={'CMHistoryGame-Game-warband-image'}
                                        />

                                        <div className={'CMHistoryGame-Game-text'}>
                                            <div className={'CMHistoryGame-Game-warband-name'}>
                                                {warband.Name}
                                            </div>
                                            <div className={'CMHistoryGame-Game-player-name'}>
                                                {warband.PlayerName}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>

                <div className={'CMHistoryGame-Players'}>
                {game.game.warbands.map((warband, index) => (
                    <CMPlayerSmall
                        key={index}
                        player={{
                            playerId: warband.PlayerId,
                            playerName: warband.PlayerName,
                            playerImageId: warband.PlayerImageId
                        }}
                    />

                    ))}
                </div>

                <div className={'CMHistoryGame-Game-stats'}>
                    <div className={'stats-scenario'}>
                        <strong>
                            {'Scenario: '}
                        </strong>
                        <span>
                            {'Relic Hunt'}
                        </span>
                    </div>

                    <div className={'stats-winner'}>
                        <strong>
                            {'Winner: '}
                        </strong>
                        <span>
                            {game.game.warbands[1].Name}
                        </span>
                    </div>


                </div>
            </div>
        </div>

    );

};

export default CMHistoryGame;