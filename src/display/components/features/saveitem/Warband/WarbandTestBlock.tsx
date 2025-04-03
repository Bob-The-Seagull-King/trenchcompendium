import 'bootstrap/dist/css/bootstrap.css'
import '../../../../../resources/styles/_mainstylesource.scss'
import React, { useEffect, useRef, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

// Components
import ContentPackDisplay from '../../../../components/features/contentpack/ContentPackDisplay'

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone, faDownload, faEye, faSquareCaretUp, faSquareCaretDown, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap';
import { WarbandManager } from '../../../../../classes/saveitems/Warband/WarbandManager';
import { UserWarband } from '../../../../../classes/saveitems/Warband/UserWarband';
import { EventRunner } from '../../../../../classes/contextevent/contexteventhandler';
import { ExplorationLocation } from '../../../../../classes/feature/exploration/ExplorationLocation';
import { ExplorationFactory } from '../../../../../factories/features/ExplorationFactory';
import { WarbandProperty } from '../../../../../classes/saveitems/Warband/WarbandProperty';

const WarbandTestBlock = (prop: any) => {


    const [warbandproperty, setvwarbandproperty] = useState<WarbandProperty | null>(null)
    const [location, setlocation] = useState<ExplorationLocation | null>(null)
    const [_keyvar, setkeyvar] = useState(0);

    
        useEffect(() => {
            async function SetModelOptions() {                
                const LocationVal : ExplorationLocation = await ExplorationFactory.CreateNewExplorationLocation("el_testselect", null);
                
                if (LocationVal) {
                    setlocation(LocationVal)
                    const NewProperty : WarbandProperty = new WarbandProperty(LocationVal, null, null, null)
                    setvwarbandproperty(NewProperty);
                    setkeyvar((prev) => prev + 1);
                }

            }
        
            SetModelOptions();
        }, []);

        function SelectOptionA() {
            warbandproperty?.SelectSelfOption(0,0);
        }

        function SelectOptionB() {
            warbandproperty?.SelectSelfOption(0,1);
        }

        function SelectOptionBSubA() {
            warbandproperty?.SubProperties[0].SelectSelfOption(0,0);
        }

        function SelectOptionBSubB() {
            warbandproperty?.SubProperties[0].SelectSelfOption(0,1);
        }

        function RegenBuild() {         
            const Converted = warbandproperty?.ConvertToInterface();      
            if (location && Converted) {
                const NewProperty : WarbandProperty = new WarbandProperty(location, null, null, Converted)
                console.log(NewProperty)
            }

        }

    return (
        
        <ErrorBoundary fallback={<div>Something went wrong with SaveWarbandDisplay.tsx</div>}>
            <div className='fillspace' >
                <div className="row">
                    <div className="col-4">
                        <Button title='Console Log property' onClick={() => (console.log(warbandproperty))}>
                            Log Out WarbandProperty
                            </Button>
                    </div>
                    <div className="col-4">
                        <Button title='Console Log property' onClick={() => (SelectOptionA())}>
                            Select Option A
                        </Button>
                    </div>
                    <div className="col-4">
                        <Button title='Console Log property' onClick={() => (SelectOptionB())}>
                            Select Option B
                        </Button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        
                        <Button title='Console Log property' onClick={() => (console.log(warbandproperty?.ConvertToInterface()))}>
                            Log Out Interface
                        </Button>
                    </div>
                    <div className="col-4">
                        <Button title='Console Log property' onClick={() => (SelectOptionBSubA())}>
                            Select Option B Suboption A
                        </Button>
                    </div>
                    <div className="col-4">
                        <Button title='Console Log property' onClick={() => (SelectOptionBSubB())}>
                            Select Option B Suboption B
                        </Button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        
                        <Button title='Console Log property' onClick={() => RegenBuild()}>
                            Log Out Regened
                        </Button>
                    </div>
                    <div className="col-4">
                        B2
                    </div>
                    <div className="col-4">
                        C2
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
    // -------------------------------------------
}

export default WarbandTestBlock