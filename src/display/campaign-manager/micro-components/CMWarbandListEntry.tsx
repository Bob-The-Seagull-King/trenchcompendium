import React from 'react';
import SynodImageWithCredit from "../../../utility/SynodImageWithCredits";
import CMRoundNumber from "./CMRoundNumber";
import {useNavigate} from "react-router-dom";
import CustomNavLink from "../../components/subcomponents/interactables/CustomNavLink";

// @TODO: this is only dummy data
interface CMWarbandListEntryProps {
    warband: {
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
    };
}

const CMWarbandListEntry: React.FC<CMWarbandListEntryProps> = ({ warband }) => {

    const navigate = useNavigate();

    return (
        <div className="CMWarbandListEntry">
            <CustomNavLink
                classes={'wb-image-wrap'}
                link={`/warband/detail/${warband.warbandId}`}
                runfunc={() => {
                    navigate(`/warband/detail/${warband.warbandId}`)
                }}>
                <SynodImageWithCredit
                    imageId={warband.warbandImageId}
                    className={''}
                />
                <CMRoundNumber round={warband.warbandRound} />
            </CustomNavLink>


            <div className={'CMWarbandListEntry-text'}>
                <CustomNavLink
                    classes={'CMWarbandListEntry-wb-name'}
                    link={`/warband/detail/${warband.warbandId}`}
                    runfunc={() => {
                        navigate(`/warband/detail/${warband.warbandId}`)
                    }}>
                    {warband.warbandName}
                </CustomNavLink>
                <div className={'CMWarbandListEntry-wb-rating'}>
                    {warband.warbandRating}
                </div>

                <CustomNavLink
                    classes={'CMWarbandListEntry-player-name'}
                    link={`/profile/${warband.playerId}`}
                    runfunc={() => {
                        navigate(`/profile/${warband.playerId}`)
                    }}>
                    {warband.playerName}
                </CustomNavLink>
            </div>

        </div>
    );
};

export default CMWarbandListEntry;