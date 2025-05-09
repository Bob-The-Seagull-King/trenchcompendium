import '../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Item } from '../../classes/saveitems/item';
import { ScenarioGenerator } from '../../classes/feature/scenario/ScenarioGenerator';
import ScenarioDisplay from '../components/features/scenario/ScenarioDisplay';
import GenericDisplay from '../components/generics/GenericDisplay';
import { ToolsController } from '../../classes/_high_level_controllers/ToolsController';
import { Scenario } from '../../classes/feature/scenario/Scenario';

const ToolsRandomScenario = (prop: any) => {
    const Manager : ScenarioGenerator = prop.manager? prop.manager : getManager();
    
    function getManager() {        
        const ToolsManagerScenario = ToolsController.getInstance();
        ToolsManagerScenario.RandomScenarioManager = new ScenarioGenerator();

        return ToolsManagerScenario.RandomScenarioManager;
    }

    const [_currentItem, returnItem] = useState<Scenario | null>(null);
    const [_keyval, returnkey] = useState(1);

    
    useEffect(() => {
        async function SetScenario() {
            await Manager.ResetScenario();
            returnItem(Manager.CurrentScenario);
            returnkey(_keyval + 1)
        }

        SetScenario();
    }, []);
    

    async function newScenario() {
        await Manager.ResetScenario();
        returnItem(Manager.CurrentScenario);
        returnkey(_keyval + 1)
    }

    // Return result -----------------------------
    return (
        <ErrorBoundary fallback={<div>Something went wrong with ToolsRandomScenario.tsx</div>}>
            <div className="row justify-center">
                <div className="col-md-10 col-sm-12">
                    <div className="">
                        <div onClick={() => (newScenario())}className='borderstyler    softpad colorWhite tagText centerPosition'>New Scenario</div>
                    </div>
                    {_currentItem != null &&
                        <ScenarioDisplay data={_currentItem} />
                    }
                </div>
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default ToolsRandomScenario