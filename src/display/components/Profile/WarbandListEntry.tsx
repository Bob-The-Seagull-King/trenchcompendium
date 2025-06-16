/**
 * A list entry of a warband in profile view
 */
import React from 'react'
import {useNavigate} from "react-router-dom";
import CustomNavLink from "../subcomponents/interactables/CustomNavLink";
import SynodImage from "../../../utility/SynodImage";
import {UserWarband} from "../../../classes/saveitems/Warband/UserWarband";

interface WarbandListEntryProps {
    warband: UserWarband

}

const WarbandListEntry: React.FC<WarbandListEntryProps> = ({
   warband
    }) => {

    const navigate = useNavigate();

    return (
        <div className="WarbandListEntry">
            <CustomNavLink
                classes={'WarbandListEntry-image-wrap'}
                link={`/warband/${warband.GetId()}`}
                runfunc={() => {
                    navigate(`/warband/${warband.GetId()}`)
                }}>

                <img src={warband.GetImageThumbnailURL()} alt={warband.GetWarbandName() + ' Image'} className={'WarbandListEntry-image'} />

            </CustomNavLink>

            <div className={'WarbandListEntry-text'}>
                <CustomNavLink
                    classes={'warband-name'}
                    link={`/warband/${warband.GetId()}`}
                    runfunc={() => {
                        navigate(`/warband/${warband.GetId()}`)
                    }}>
                    {warband.GetWarbandName()}
                </CustomNavLink>

                <div className={'warband-faction'}>
                    {warband.GetFactionName()}
                </div>
                <div className={'warband-value'}>
                    {warband.GetCostDucatsTotal() + ' Ductas'}
                    {' | '}
                    {warband.GetCostGloryTotal() + ' Glory'}
                </div>
            </div>
        </div>
    )
}

export default WarbandListEntry
