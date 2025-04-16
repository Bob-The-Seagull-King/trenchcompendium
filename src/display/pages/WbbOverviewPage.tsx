import React from 'react';
import WbbWarbandListItem from "../components/warband-builder/WbbWarbandListItem";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faPlus} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import { WarbandManager } from '../../classes/saveitems/Warband/WarbandManager';
import CustomNavLink from '../components/subcomponents/interactables/CustomNavLink';


/**
 * This is the warband overview page,
 * - here, the saved warbands for this user are shown
 * - user can navigate to create a new Warband
 *
 * @constructor
 */
const WbbOverviewPage = (prop: any) => {
    const Manager : WarbandManager = prop.manager;
    const navigate = useNavigate();

    // These are warband items for testing the Markup
    // - Once the warband data is available these can be removed
    const testing_items = [
        {
            name: "The Iron Capirotes",
            synod_id: 122,
            faction_id: "fc_trenchpilgrim",
            faction_name: "Trench Pilgrims",
            value_ducats: 749,
            value_glory: 2,
            campaign_id: 123,
            campaign_name: "Ipsum campaign name",
        },
        {
            name: "The Iron Capirotes v2",
            synod_id: 123,
            faction_id: "fc_trenchpilgrim",
            faction_name: "Trench Pilgrims",
            value_ducats: 799,
            value_glory: 0,
        },
        {
            name: "Assassins are cool",
            synod_id: 124,
            faction_id: "fc_ironsultanate_fv_fidaiofalamut",
            faction_name: "Fida’i of Alamut – The Cabal of Assassins",
            value_ducats: 749,
            value_glory: 2,
            campaign_id: 123,
            campaign_name: "Dolor sit the cool campaign name",
        }
    ];

    /**
     * Navigates to create new WB Screen
     */
    const handleCreateNew = () => {
        navigate('/warband/new');

    };




    return (
        <div className={'WbbOverviewPage'}>
            <div className={'container'}>
                <div className={'headline-wrap'}>
                    <h1>Your Warbands</h1>

                    
                    <div className={'btn btn-primary btn-new-warband'} >
                        <CustomNavLink runfunc={handleCreateNew} link={'/warband/new'}>
                            <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>

                            <span className={'new-warband-label'}>
                                {'New Warband'}
                            </span>
                        </CustomNavLink>
                    </div>
                </div>

                <div className={'row'}>
                    {testing_items.map(item => (
                        <WbbWarbandListItem key={item.synod_id} item={item} />
                    ))}

                    <div className={'col-12 col-md-6'}>
                            <CustomNavLink runfunc={handleCreateNew} link={'/warband/new'}>
                                <div className={'WbbWarbandListItem-new'} >
                                    <FontAwesomeIcon icon={faPlus} className="icon-inline-left-l"/>

                                    {'New Warband'}
                                </div>
                            </CustomNavLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WbbOverviewPage;