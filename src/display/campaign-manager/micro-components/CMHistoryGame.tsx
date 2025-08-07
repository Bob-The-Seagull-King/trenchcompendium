import {useCampaign} from "../../../context/CampaignContext";
import SynodImageWithCredit from "../../../utility/SynodImageWithCredits";
import React from "react";


interface CMHistoryGameProps {
    game: {
        date: string;
        warbands: {
            warbandName: string;
            warbandImageId: number;
            warbandId: number;
            warbandImageURL: string;
            playerName: string;
            playerProfileUrl: string;
            playerId: number;
            playerImageId: number;
            playerImageURL: string;
            warbandRating: string;
            warbandRound: number;
        }[];
    }
}

/**
 * A Game History Element
 */
const CMHistoryGame: React.FC<CMHistoryGameProps> = (game) => {
    const { campaign } = useCampaign();

    return (
        <div className="CMHistoryGame">


            <div className={'CMHistoryGame-Game'}>
                <div className={'CMHistoryGame-Game-main'}>
                    {game.game.warbands.map((warband, index) => (
                        <div className={'CMHistoryGame-Game-warband warband-count-2'} key={index}>
                            <SynodImageWithCredit
                                imageId={warband.warbandImageId}
                                className={'CMHistoryGame-Game-warband-image'}
                            />

                            <div className={'CMHistoryGame-Game-text'}>
                                <div className={'CMHistoryGame-Game-warband-name'}>
                                    {warband.warbandName}
                                </div>
                                <div className={'CMHistoryGame-Game-player-name'}>
                                    {warband.playerName}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                <div className={'CMHistoryGame-Players'}>
                {game.game.warbands.map((warband, index) => (
                        <div className={'CMHistoryPlayer'} key={index}>
                            <div className={'player-image-wrap'}>
                                <SynodImageWithCredit
                                    imageId={warband.playerImageId}
                                    className={''}
                                />
                            </div>

                            <div className={'CMHistoryPlayer-name'}>
                                {warband.playerName}
                            </div>
                        </div>
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
                            {game.game.warbands[1].warbandName}
                        </span>
                    </div>


                </div>
            </div>
        </div>

    );

};

export default CMHistoryGame;