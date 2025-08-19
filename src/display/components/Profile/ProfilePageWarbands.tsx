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
import FighterCardImageWrap from "../rules-content/FighterCard/FighterCardImageWrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";

interface ProfilePageWarbandsProps {
    userData: SiteUser | SiteUserPublic | null;
}



const ProfilePageWarbands: React.FC<ProfilePageWarbandsProps> = ({ userData }) => {

    const [warbands, setWarbands] = useState<SumWarband[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // "show all" settings
    const [showAll, setShowAll] = useState(false);
    const maxVisible = 10;


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
                            {(showAll ? warbands : warbands.slice(0, maxVisible)).map((warband) => (
                                <li key={warband.warband_data.GetPostId()} className={'warband'}>
                                    <WarbandListEntry warband={warband} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="warbands-list-empty">
                            {'No warbands found for this user.'}
                        </div>
                    )}

                    {warbands.length > maxVisible && !showAll && (
                        <div className={'show-more-button-wrap'}
                             onClick={() => setShowAll(true)}
                        >
                            <div
                                className={'show-more-button'}
                                >
                                {'Show all warbands'}
                                <FontAwesomeIcon icon={faChevronDown} className={'icon-inline-right-l'} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfilePageWarbands
