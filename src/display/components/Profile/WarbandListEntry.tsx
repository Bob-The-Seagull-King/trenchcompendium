/**
 * A list entry of a warband in profile view
 */
import React from 'react'
import {useNavigate} from "react-router-dom";
import CustomNavLink from "../subcomponents/interactables/CustomNavLink";
import SynodImage from "../../../utility/SynodImage";
import {UserWarband} from "../../../classes/saveitems/Warband/UserWarband";
import SynodFactionImage from "../../../utility/SynodFactionImage";
import { SumWarband } from '../../../classes/saveitems/Warband/WarbandManager';
import UserNotification from "./micro-components/UserNotification";
import {useAuth} from "../../../utility/AuthContext";

interface WarbandListEntryProps {
    warband: SumWarband

}

const WarbandListEntry: React.FC<WarbandListEntryProps> = ({
   warband
    }) => {

    const navigate = useNavigate();
    const { userId, isLoggedIn } = useAuth()

    return (
        <div className="WarbandListEntry">
            <CustomNavLink
                classes={'WarbandListEntry-image-wrap'}
                link={`/warband/detail/${warband.id}`}
                runfunc={() => {
                    navigate(`/warband/detail/${warband.id}`)
                }}>

                <SynodFactionImage
                    className={'WarbandListEntry-image'}
                    factionSlug={warband.warband_data.GetFactionSlug()}
                />
            </CustomNavLink>

            <div className={'WarbandListEntry-text'}>
                <CustomNavLink
                    classes={'warband-name d-inline-block position-relative'}
                    link={`/warband/detail/${warband.id}`}
                    runfunc={() => {
                        navigate(`/warband/detail/${warband.id}`)
                    }}>
                    {warband.warband_data.GetWarbandName()}

                    {(warband.warband_data.GetCampaignInvites().length > 0 &&
                        !warband.warband_data.GetCampaignId() &&
                        userId && warband.warband_data.IsOwner(userId)) &&
                            <UserNotification
                                content={'!'}
                                size={'small'}
                            />
                    }
                </CustomNavLink>

                <div className={'warband-faction'}>
                    {warband.warband_data.GetFactionName()}
                </div>

                <div className={'warband-value'}>
                    {warband.warband_data.GetRatingDucats() + ' Ducats'}
                    {' | '}
                    {warband.warband_data.GetRatingGlory() + ' Glory'}
                </div>
            </div>
        </div>
    )
}

export default WarbandListEntry
