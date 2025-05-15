import '../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";


// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { ControllerController } from '../../../classes/_high_level_controllers/ControllerController';
import { ToolsController } from '../../../classes/_high_level_controllers/ToolsController';
import RulesMenuItem from "../rules-content/RulesMenuItem";
import CustomNavLink from '../subcomponents/interactables/CustomNavLink';

interface RulesMenuBodyProps {
    controller: any;
    onBack: () => void;
}

const WBBMenuBody: React.FC<RulesMenuBodyProps> = ({ controller, onBack }) => {

    // Navigation
    const navigate = useNavigate();

    function NavigateHome() {
        navigate('/', {state: Date.now().toString()});
    }

    const [warband_struc, setwarbands] = useState([{
        title: "New Warband",
        slug: "new"
    }])
    const [keyvar, setkeyvar] = useState(0);


    useEffect(() => {
        async function SetWarbands() {

            const SetOfWarbands : any[] = []

            const tools : ToolsController = ToolsController.getInstance();
            await tools.UserWarbandManager.GetItemsAll();

            for (let i = 0; i < tools.UserWarbandManager.WarbandItemList.length; i++) {
                SetOfWarbands.push(
                    {
                        title: tools.UserWarbandManager.WarbandItemList[i].Name,
                        slug: 'edit/'+tools.UserWarbandManager.WarbandItemList[i].ID
                    }
                )
            }

            const WarbandSet : any[] = [
                {
                    title: "New Warband",
                    slug: "new"
                },
                {
                    title: "Your Warbands",
                    slug: "",
                    children: SetOfWarbands
                }
            ]

            setwarbands(WarbandSet);
            setkeyvar(keyvar + 1);
        }

        SetWarbands();
    }, []);



    return (
        <ErrorBoundary fallback={<div>Something went wrong with RulesMenuBody.tsx</div>}>
            <div className={'WBBMenuBody menu-body'}>
                <div className={'rules-menu-header'}>
                    <div onClick={onBack} className={'home-link'}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </div>

                    <CustomNavLink
                        classes={'compendium-link'}
                        link={`/warband/`}
                        runfunc={() => {navigate('/warband/')}}
                    >
                           {'Warband Manager'}
                    </CustomNavLink>
                </div>

                <RulesMenuItem key={'warbands' + keyvar.toString()}
                               data={warband_struc}
                               parentPath={'warband'}
                />

            </div>
        </ErrorBoundary>

    );
}

export default WBBMenuBody

