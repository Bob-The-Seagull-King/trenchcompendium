import 'bootstrap/dist/css/bootstrap.css'
import '../../resources/styles/_mainstylesource.scss'
import React, { useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SaveItemListDisplay from '../components/features/saveitem/SaveItemListDisplay';
import SaveItemViewDisplay from '../components/features/saveitem/SaveItemViewDisplay';
import { Item } from '../../classes/saveitems/item';
import { ScenarioGenerator } from '../../classes/feature/scenario/ScenarioGenerator';
import ScenarioDisplay from '../components/features/scenario/ScenarioDisplay';
import GenericDisplay from '../components/generics/GenericDisplay';

const ToolsRandomScenario = (prop: any) => {
    const Manager : ScenarioGenerator = prop.manager;
    
    const [_currentItem, returnItem] = useState(Manager.CurrentScenario);
    const [_keyval, returnkey] = useState(1);

    function newScenario() {
        Manager.ResetScenario();
        returnItem(Manager.CurrentScenario);
        returnkey(_keyval + 1);
    }

    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with ToolsRandomScenario.tsx</div>}>
            <div className="row justify-center">
                <div className="col-md-10 col-sm-12">
                    <div className="">
                        <div onClick={() => (newScenario())}className='borderstyler backgrounddefault borderdefault hovermouse softpad colorWhite tagText centerPosition'>New Scenario</div>
                    </div>
                    <div className="row">
                        <div className="verticalspacerbig"/>
                    </div>
                    <div className="">
                        <GenericDisplay  d_colour={"default"} d_name={_currentItem.Name} d_type={""} d_method={() => <ScenarioDisplay data={_currentItem} />}/>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default ToolsRandomScenario