/**
 * A list entry of a warband in profile view
 */
import React from 'react'
import {useNavigate} from "react-router-dom";
import CustomNavLink from "../subcomponents/interactables/CustomNavLink";
import SynodImage from "../../../utility/SynodImage";

interface WarbandListEntryProps {
    warbandId: number
    warbandImageID: number
    warbandName: string
    warbandFactionName: string
    warbandValue: string
}

const WarbandListEntry: React.FC<WarbandListEntryProps> = ({
        warbandId,
        warbandImageID,
        warbandName,
        warbandFactionName,
        warbandValue
    }) => {

    const navigate = useNavigate();


    return (
        <div className="WarbandListEntry">
            <CustomNavLink
                classes={'WarbandListEntry-image-wrap'}
                link={`/warband/${warbandId}`}
                runfunc={() => {
                    navigate(`/warband/${warbandId}`)
                }}>
                <SynodImage
                    imageId={warbandImageID}
                    className={'WarbandListEntry-image'}
                />
            </CustomNavLink>

            <div className={'WarbandListEntry-text'}>
                <CustomNavLink
                    classes={'warband-name'}
                    link={`/warband/${warbandId}`}
                    runfunc={() => {
                        navigate(`/warband/${warbandId}`)
                    }}>
                    {warbandName}
                </CustomNavLink>

                <div className={'warband-faction'}>
                    {warbandFactionName}
                </div>
                <div className={'warband-value'}>
                    {warbandValue}
                </div>
            </div>
        </div>
    )
}

export default WarbandListEntry
