import React from "react";
import {useCampaign} from "../../../context/CampaignContext";
import CustomNavLink from "../../components/subcomponents/interactables/CustomNavLink";
import SynodImageWithCredit from "../../../utility/SynodImageWithCredits";
import {useNavigate} from "react-router-dom";
import {CampaignUser} from "../../../classes/saveitems/Campaign/CampaignUser";
import {CampaignWarband} from "../../../classes/saveitems/Campaign/CampaignWarband";



interface CMPlayerSmallProps {
    warband: CampaignWarband;
    useNav?: boolean; // should this be a navigatable element?
}

/**
 * The history Panel in the Campaign Manager
 */
const CMWarbandSmallVertical: React.FC<CMPlayerSmallProps> = ({ useNav = false, warband }) => {

    const { campaign } = useCampaign();
    const navigate = useNavigate();

    if( !warband ) {
        return null
    }

    console.log(warband);

    if( !useNav ) {
        return (
            <div className="CMPlayerSmallVertical">
                <div
                    className={'player-image-wrap'}
                >
                    <SynodImageWithCredit
                        imageId={warband.ImageId}
                        className={''}
                    />
                </div>

                <div
                    className={'CMHistoryPlayer-name'}
                >
                    {warband.Name}
                </div>
            </div>
        )
    }

    return (
        <div className="CMPlayerSmallVertical">
            <CustomNavLink
                classes={'player-image-wrap'}
                link={warband.WarbandUrl}
                runfunc={() => {
                    navigate(warband.WarbandUrl, {state: Date.now().toString()})
                }}>
                <SynodImageWithCredit
                    imageId={warband.ImageId}
                    className={''}
                />
            </CustomNavLink>

            <CustomNavLink
                classes={'CMHistoryPlayer-name'}
                link={warband.WarbandUrl}
                runfunc={() => {
                    navigate(warband.WarbandUrl, {state: Date.now().toString()})
                }}>
                {warband.Name}
            </CustomNavLink>
        </div>
    );
};

export default CMWarbandSmallVertical;