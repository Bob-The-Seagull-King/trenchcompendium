/**
 * A list entry of a warband in profile view
 */
import React from 'react'
import {useNavigate} from "react-router-dom";
import CustomNavLink from "../subcomponents/interactables/CustomNavLink";
import SynodImage from "../../../utility/SynodImage";
import {UserWarband} from "../../../classes/saveitems/Warband/UserWarband";
import SynodFactionImage from "../../../utility/SynodFactionImage";

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

                <SynodFactionImage
                    className={'WarbandListEntry-image'}
                    factionSlug={warband.GetFactionSlug()}
                />
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
