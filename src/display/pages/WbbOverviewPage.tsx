import React, { useEffect, useState } from 'react';
import WbbWarbandListItem from "../components/warband-builder/WbbWarbandListItem";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faPlus} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import { SumWarband, WarbandManager } from '../../classes/saveitems/Warband/WarbandManager';
import CustomNavLink from '../components/subcomponents/interactables/CustomNavLink';
import { UserWarband } from '../../classes/saveitems/Warband/UserWarband';
import PageMetaInformation from "../components/generics/PageMetaInformation";


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

    const [allwarbands, setwarbands] = useState<SumWarband[]>([])
    const [keyvar, setkeyvar] = useState(0);
    
    useEffect(() => {
        async function SetWarbands() {
            await Manager.GetItemsAll();
            setwarbands(Manager.WarbandItemList);
            setkeyvar((prev) => prev + 1);
        }

        SetWarbands();
    }, []);

    function updateSelf() {
        Manager.SetStorage();
        setkeyvar((prev) => prev + 1);
    }

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
                    <PageMetaInformation
                        title={'Your Warbands'}
                        description={'Manage your warbands in Trench Companion, the official resource for Trench Crusade.'}
                    />

                    <h1>{'Your Warbands'}</h1>

                    
                    <CustomNavLink
                        classes={'btn btn-primary btn-new-warband'}
                        runfunc={handleCreateNew}
                        link={'/warband/new'}>
                        <FontAwesomeIcon
                            icon={faPlus}
                            className="icon-inline-left-l"/>

                        <span className={'new-warband-label'}>
                            {'New Warband'}
                        </span>
                    </CustomNavLink>
                </div>

                <div className={'row'} key={keyvar}>
                    {allwarbands.map(item => (
                        <WbbWarbandListItem key={item.warband_data.ID} item={item} manager={Manager} parentfunc={updateSelf}/>
                    ))}

                    <div className={'col-12 col-lg-6'}>
                        <CustomNavLink
                            runfunc={handleCreateNew}
                            link={'/warband/new'}
                            classes={'WbbWarbandListItem-new'}
                        >
                            <div className={'WbbWarbandListItem-new-inner'}>
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