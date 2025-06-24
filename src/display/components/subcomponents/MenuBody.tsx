import '../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

import Dropdown from 'react-bootstrap/Dropdown';

// Font Awesome
import { useNavigate } from 'react-router-dom';
import GenericCollapsableBlockDisplay from '../../components/generics/GenericCollapsableBlockDisplay';
import { ControllerController } from '../../../classes/_high_level_controllers/ControllerController';
import CompendiumMenuItem from '../../headers/components/CompendiumMenuItem';
import GenericLinkedCollapsableBlockDisplay from '../generics/GenericLinkedCollapsableBlockDisplay';

interface IControllerProp {
    controller : ControllerController; // The controller being passed through
}

const MenuBody: React.FC<IControllerProp> = (prop) => {
    // Navigation
    const navigate = useNavigate(); 
    
    /**
     * Navigate to a page
     * @param dir The page to navigate to
     */
    function NavigateOut() {
        navigate('/', {state: Date.now().toString()});
    }

    function returnCompendiumMenu() {
        return (
            <>
                <GenericLinkedCollapsableBlockDisplay
                    d_name={"Rules"}
                    d_colour={"grey"} 
                    d_state={false}  
                    bordertype={0}
                    d_link={'/compendium/gamerule'}
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
            <div onClick={() => NavigateOut()} className={'      backgroundBgBase borderthin bordergrey'}>
                <div className=''>
                    {"Home"}
                </div>
            </div>
            <GenericLinkedCollapsableBlockDisplay 
                d_name={"Compendium"} 
                d_colour={"grey"} 
                d_state={false}  
                bordertype={0}
                d_link={'/compendium/'}
                d_method={() => returnCompendiumMenu()} />

            </>
        </ErrorBoundary>
        
      );
}

export default MenuBody

