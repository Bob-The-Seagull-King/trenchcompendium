import 'bootstrap/dist/css/bootstrap.css'
import '../../../resources/styles/_mainstylesource.scss'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";
import Offcanvas from 'react-bootstrap/Offcanvas';

import Dropdown from 'react-bootstrap/Dropdown';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun } from '@fortawesome/free-solid-svg-icons'
import { faMoon } from '@fortawesome/free-solid-svg-icons'
import { useGlobalState } from '../../../utility/globalstate'
import { useNavigate } from 'react-router-dom';
import GenericCollapsableBlockDisplay from '../../components/generics/GenericCollapsableBlockDisplay';
import PalleteSwap from '../../headers/components/PalleteSwap';
import LanguageSwap from '../../headers/components/LanguageSwap';
import { ControllerController } from '../../../classes/_high_level_controllers/ControllerController';
import CompendiumMenuItem from '../../headers/components/CompendiumMenuItem';

interface IControllerProp {
    controller : ControllerController; // The controller being passed through
    closeFunc : any;
    showState : any;
    responseshow : string;
}

const MenuBody: React.FC<IControllerProp> = (prop) => {

    // State
    const [theme, setTheme] = useGlobalState('theme');

    if ((theme == "" ) || (theme == null)) { // Default theme to light
        setTheme('dark');
    }
        
    // Navigation
    const navigate = useNavigate(); 
    
    /**
     * Navigate to a page
     * @param dir The page to navigate to
     */
    function NavigateOut() {
        navigate('/');
    }

    function returnCompendiumMenu() {
        return (
            <>
                <GenericCollapsableBlockDisplay 
                    d_name={"Rules"} 
                    d_colour={"grey"} 
                    d_state={false}  
                    bordertype={0}
                    d_method={() => <>
                        <CompendiumMenuItem bordertype={0} controller={prop.controller.CampaignRulesCollectionController}/>
                        <CompendiumMenuItem bordertype={0} controller={prop.controller.GameRulesCollectionController}/>
                        <CompendiumMenuItem bordertype={0} controller={prop.controller.GlossaryCollectionController}/>
                        <CompendiumMenuItem bordertype={0} controller={prop.controller.KeywordCollectionController}/>
                    </>} />
                <GenericCollapsableBlockDisplay 
                    d_name={"Warbands"} 
                    d_colour={"grey"} 
                    d_state={false}  
                    bordertype={0}
                    d_method={() => <>
                        <CompendiumMenuItem bordertype={0} controller={prop.controller.EquipmentCollectionController}/>
                        <CompendiumMenuItem bordertype={0} controller={prop.controller.FactionCollectionController}/>
                        <CompendiumMenuItem bordertype={0} controller={prop.controller.ModelCollectionController}/>
                    </>} />
                <CompendiumMenuItem bordertype={0} controller={prop.controller.ScenarioCollectionController}/>
                <GenericCollapsableBlockDisplay 
                    d_name={"Campaigns"} 
                    d_colour={"grey"} 
                    d_state={false}  
                    bordertype={0}
                    d_method={() => <>
                        <CompendiumMenuItem bordertype={0} controller={prop.controller.ExplorationTableCollectionController}/>
                        <CompendiumMenuItem bordertype={0} controller={prop.controller.InjuryCollectionController}/>
                        <CompendiumMenuItem bordertype={0} controller={prop.controller.PatronCollectionController}/>
                        <CompendiumMenuItem bordertype={0} controller={prop.controller.SkillGroupCollectionController}/>
                    </>} />
            </>
        )
    }
    
    return (
        <ErrorBoundary fallback={<div>Something went wrong with PalleteSwap.tsx</div>}>  
            <>
            <div onClick={() => NavigateOut()} className={'align-left-right size-strongtext font-default hovermouse colorBasicText centered-div backgroundBgBase borderthin bordergrey'}>
                <div className='totalmarginmed'>
                    {"Home"}
                </div>
            </div>
            <GenericCollapsableBlockDisplay 
                d_name={"Compendium"} 
                d_colour={"grey"} 
                d_state={false}  
                bordertype={0}
                d_method={() => returnCompendiumMenu()} />

            </>
        </ErrorBoundary>
        
      );
}

export default MenuBody

