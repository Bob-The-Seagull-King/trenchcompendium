import {useCampaign} from "../../../context/CampaignContext";
import SynodImageWithCredit from "../../../utility/SynodImageWithCredits";
import React from "react";
import {useNavigate} from "react-router-dom";
import CustomNavLink from "../../components/subcomponents/interactables/CustomNavLink";


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
                        );
                    })}
                </div>

                <div className={'CMHistoryGame-Players'}>
                {game.game.warbands.map((warband, index) => (
                        <div className={'CMHistoryPlayer'} key={index}>
                            <CustomNavLink
                                classes={'player-image-wrap'}
                                link={`/profile/${warband.playerId}`}
                                runfunc={() => {
                                    navigate(`/profile/${warband.playerId}`, {state: Date.now().toString()})
                                }}>
                                <SynodImageWithCredit
                                    imageId={warband.playerImageId}
                                    className={''}
                                />
                            </CustomNavLink>

                            <CustomNavLink
                                classes={'CMHistoryPlayer-name'}
                                link={`/profile/${warband.playerId}`}
                                runfunc={() => {
                                    navigate(`/profile/${warband.playerId}`, {state: Date.now().toString()})
                                }}>
                                {warband.playerName}
                            </CustomNavLink>
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