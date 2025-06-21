/**
 * A list of warbands for a user
 */

import React, {useEffect, useState} from 'react'
import CampaignListEntry from "./CampaignListEntry";
import WarbandListEntry from "./WarbandListEntry";
import {SiteUser} from "../../../classes/user_synod/site_user";
import {SiteUserPublic} from "../../../classes/user_synod/user_public";
import LoadingOverlay from "../generics/Loading-Overlay";
import {UserWarband} from "../../../classes/saveitems/Warband/UserWarband";
import { SumWarband } from '../../../classes/saveitems/Warband/WarbandManager';

interface ProfilePageWarbandsProps {
    userData: SiteUser | SiteUserPublic | null;
}



const ProfilePageWarbands: React.FC<ProfilePageWarbandsProps> = ({ userData }) => {

    const [warbands, setWarbands] = useState<SumWarband[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadWarbands = async () => {

            if (!userData || typeof userData.GetWarbands !== 'function') return;

            try {
                setIsLoading(true);
                const warbandList = await userData.GetWarbands();

                // Extract the warband_data objects (UserWarband instances)
                const warbandObjects: SumWarband[] = warbandList.map((entry: any) => entry);

                setWarbands(warbandObjects);
            } catch (error) {
                console.error('Failed to load warbands:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadWarbands();
    }, [userData]);

    if (isLoading) {
        return (
            <div className="ProfilePageWarbands">
                <div className={'profile-card'}>
                    <div className={'profile-card-head'}>
                        {'Warbands'}
                    </div>

                    <div className={'profile-card-content'}>
                        <div className={'profile-card-loading'}>
                            <LoadingOverlay
                                message={'Loading Warbands'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="ProfilePageWarbands">
            <div className={'profile-card'}>
                <div className={'profile-card-head'}>
                    {'Warbands'}
                </div>

                <div className={'profile-card-content'}>
                    {warbands.length > 0 ? (
                        <ul className={'warbands-list'}>
                            {warbands.map((warband) => (
                                <li key={warband.warband_data.GetId()} className={'warband'}>
                                    <WarbandListEntry
                                        warband={warband}
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="warbands-list-empty">
                            {'No warbands found for this user.'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfilePageWarbands
