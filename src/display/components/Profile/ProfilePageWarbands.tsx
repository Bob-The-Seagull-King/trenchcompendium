/**
 * A list of warbands for a user
 */

import React from 'react'
import CampaignListEntry from "./CampaignListEntry";
import WarbandListEntry from "./WarbandListEntry";

interface ProfilePageWarbandsProps {
    userId: number
}

const ProfilePageWarbands: React.FC<ProfilePageWarbandsProps> = ({ userId }) => {

    // @TODO: Replace with Synod Data
    const warbands = [
        {
            warbandID: 1,
            warbandImageID: 183,
            warbandName: 'A very spooky Warband',
            warbandFactionName: 'Trench Ghosts',
            warbandValue: '700 Ducats / 2 Glory'
        },
        {
            warbandID: 2,
            warbandImageID: 183,
            warbandName: 'The mighty Spooksters',
            warbandFactionName: 'Trench Ghosts',
            warbandValue: '850 Ducats / 0 Glory'
        },
        {
            warbandID: 4,
            warbandImageID: 170,
            warbandName: 'The Dirge',
            warbandFactionName: 'Dirge of the Great Hegemon',
            warbandValue: '700 Ducats / 0 Glory'
        }
    ]


    return (
        <div className="ProfilePageWarbands">
            <div className={'profile-card'}>
                <div className={'profile-card-head'}>
                    {'Warbands'}
                </div>

                <div className={'profile-card-content'}>
                    <ul className={'warbands-list'}>
                        {warbands.map((warband) => (
                            <li key={warband.warbandID} className={'warband'}>
                                <WarbandListEntry
                                    warbandId={warband.warbandID}
                                    warbandImageID={warband.warbandImageID}
                                    warbandName={warband.warbandName}
                                    warbandFactionName={warband.warbandFactionName}
                                    warbandValue={warband.warbandValue}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ProfilePageWarbands
