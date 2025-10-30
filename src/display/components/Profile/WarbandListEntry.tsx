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

interface WarbandListEntryProps {
    warband: SumWarband

}

const WarbandListEntry: React.FC<WarbandListEntryProps> = ({
   warband
    }) => {

    const navigate = useNavigate();

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
                    classes={'warband-name'}
                    link={`/warband/detail/${warband.id}`}
                    runfunc={() => {
                        navigate(`/warband/detail/${warband.id}`)
                    }}>
                    {warband.warband_data.GetWarbandName()}
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
