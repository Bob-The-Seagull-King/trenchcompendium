import React from 'react';
import SynodImageWithCredit from "../../../utility/SynodImageWithCredits";
import CMRoundNumber from "./CMRoundNumber";
import {useNavigate} from "react-router-dom";
import CustomNavLink from "../../components/subcomponents/interactables/CustomNavLink";
import CMContextualPopover from "../components/CMContextualPopover";
import {CampaignWarband} from "../../../classes/saveitems/Campaign/Campaign";

// @TODO: this is only dummy data
interface CMWarbandListEntryProps {
    warband: CampaignWarband;
}


const CMWarbandListEntry: React.FC<CMWarbandListEntryProps> = ({ warband }) => {

    const navigate = useNavigate();

    return (
        <div className="CMWarbandListEntry">
            <CustomNavLink
                classes={'wb-image-wrap'}
                link={`/warband/detail/${warband.Id}`}
                runfunc={() => {
                    navigate(`/warband/detail/${warband.Id}`)
                }}>

                <SynodImageWithCredit
                    imageId={warband.ImageId || 0}
                    className={''}
                    size={'small'}
                />
                {/*<CMRoundNumber round={warband.warbandRound} />*/}
            </CustomNavLink>


            <div className={'CMWarbandListEntry-text'}>
                <CustomNavLink
                    classes={'CMWarbandListEntry-wb-name'}
                    link={`/warband/detail/${warband.Id}`}
                    runfunc={() => {
                        navigate(`/warband/detail/${warband.Id}`)
                    }}>
                    {warband.Name}
                </CustomNavLink>
                <div className={'CMWarbandListEntry-wb-rating'}>
                    {warband.RatingDucats}
                </div>

                <CustomNavLink
                    classes={'CMWarbandListEntry-player-name'}
                    link={`/profile/${warband.PlayerId}`}
                    runfunc={() => {
                        navigate(`/profile/${warband.PlayerId}`)
                    }}>
                    {warband.PlayerName}
                </CustomNavLink>
            </div>

            <CMContextualPopover
                id={`warband-${warband.PlayerId}`}
                type="warband"
                item={warband} // this is a placeholder
            />

        </div>
    );
};

export default CMWarbandListEntry;