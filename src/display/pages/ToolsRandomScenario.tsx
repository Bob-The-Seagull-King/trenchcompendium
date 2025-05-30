import '../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import 'react-toastify/dist/ReactToastify.css';
import { GenerateDeployment, GenerateObjective, ScenarioGenerator, ScenarioSet } from '../../classes/feature/scenario/ScenarioGenerator';
import ScenarioDisplay from '../components/features/scenario/ScenarioDisplay';
import GenericDisplay from '../components/generics/GenericDisplay';
import { ToolsController } from '../../classes/_high_level_controllers/ToolsController';
import PageMetaInformation from "../components/generics/PageMetaInformation";
import { useLocation } from 'react-router-dom';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faRotate} from "@fortawesome/free-solid-svg-icons";

const ToolsRandomScenario = (prop: any) => {
    const Manager : ScenarioGenerator = prop.manager? prop.manager : getManager();
    
    const urlPath = useLocation().pathname;
    const urlSplits = urlPath.split('/');
    
    function getManager() {        
        const ToolsManagerScenario = ToolsController.getInstance();
        if (ToolsManagerScenario.RandomScenarioManager == undefined) {
            ToolsManagerScenario.RandomScenarioManager = new ScenarioGenerator();
        }

        return ToolsManagerScenario.RandomScenarioManager;
    }

    function GetCode() {
        
        if (urlSplits.length > 4) {
            const CurItemID = urlSplits.slice(-1)[0]
            console.log(CurItemID)
            return CurItemID;
        }
        return null;
    }

    const [_currentItem, returnItem] = useState<ScenarioSet | null>(getScenario());
    const [_keyval, returnkey] = useState(1);

    function getScenario() {
        if (Manager.CurrentScenario != undefined) {
            return Manager.CurrentScenario;
        }
        return null;
    }

    console.log('_currentItem');
    console.log(_currentItem);

    useEffect(() => {
        async function SetScenario() {
            
            const code : string | null = GetCode();
            if (code != null) {
                await Manager.SetCodeScenario(code);
                returnItem(Manager.CurrentScenario);
                returnkey(_keyval + 1)
            }
            if (Manager.CurrentScenario == null || Manager.CurrentScenario == undefined) {
                await Manager.ResetScenario();
                returnItem(Manager.CurrentScenario);
                returnkey(_keyval + 1)
            }
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
            <div className={'rules-content-main'}>
                <div className={'ToolsRandomScenario'}>
                    <PageMetaInformation
                        title={'Random Scenario Generator'}
                        description={'Have a scenario randomly generated for you'}
                    />

                    <h1>
                        {'Random Scenario Generator'}
                    </h1>

                    {_currentItem != null &&
                    <table className={'table_headed table_headed-highlight'}>
                        <tr className={'table-headrow'}>
                            <th colSpan={2}>
                                {'Random Scenario'}
                            </th>
                        </tr>

                        <tr className={'table_row'}>
                            <td>
                                {'Scenario Type'}
                            </td>
                            <td>
                                {_currentItem.infobox.obj}
                            </td>
                        </tr>

                        <tr className={'table_row'}>
                            <td>
                                {'Deployment'}
                            </td>
                            <td>
                                {_currentItem.infobox.dep}
                            </td>
                        </tr>

                        <tr className={'table_row'}>
                            <td>
                                {'Glorious Deeds'}
                            </td>
                            <td>                                
                                {_currentItem.infobox.gl_a_1}{', '}                                
                                {_currentItem.infobox.gl_a_2}{', '}
                                {_currentItem.infobox.gl_b_1}{', '}
                                {_currentItem.infobox.gl_b_2}{', '}
                                {_currentItem.infobox.gl_fn}
                            </td>
                        </tr>

                        {_currentItem != null &&
                            <tr className={'table_row'}>
                                <td>
                                    {'Scenario Code'}
                                </td>
                                <td>
                                    {_currentItem?.id}
                                </td>
                            </tr>
                        }
                        <tr className={'table_row'}>
                            <td colSpan={2}>
                                {/* Generator Button */}
                                <div
                                    onClick={() => (newScenario())}
                                    className='btn btn-primary'
                                >
                                    <FontAwesomeIcon icon={faRotate} className="icon-inline-left-l"/>

                                    {'Roll new Scenario'}
                                </div>
                            </td>
                        </tr>
                    </table>
                    }

                    <h2>
                        {'Scenario Rules'}
                    </h2>

                    {_currentItem != null &&
                        <ScenarioDisplay data={_currentItem.genscen} />
                    }
                </div>
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default ToolsRandomScenario