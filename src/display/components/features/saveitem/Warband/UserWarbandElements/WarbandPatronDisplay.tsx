import '../../../../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { GlossaryRule } from '../../../../../../classes/feature/glossary/Glossary'
import { returnDescription } from '../../../../../../utility/util'
import { ModelCollection } from '../../../../../../classes/feature/model/ModelCollection';
import { Model } from '../../../../../../classes/feature/model/Model';
import { Ability } from '../../../../../../classes/feature/ability/Ability';
import OptionSetStaticDisplay from '../../../../subcomponents/description/OptionSetStaticDisplay';
import { UserWarband } from '../../../../../../classes/saveitems/Warband/UserWarband';
import { WarbandManager } from '../../../../../../classes/saveitems/Warband/WarbandManager';
import { Patron } from '../../../../../../classes/feature/skillgroup/Patron';
import { Form } from 'react-bootstrap';
import { makestringpresentable } from '../../../../../../utility/functions';
import PatronDisplay from '../../../../features/skill/PatronDisplay';

const WarbandPatronDisplay = (props: any) => {
    const Warband: UserWarband = props.wrbnd
    const Manager: WarbandManager = props.mngr
    const UpdateFunction = props.updater;

    const [patrons, setpatrons] = useState<Patron[]>([])
    const [curpatron, setcurpatron] = useState<Patron | null>(Warband.GetPatron())
    const [keyval, setkey] = useState(0);

    useEffect(() => {
        async function SetWarbandPatronOptions() {                
            const PatronList = await Warband.GetPatronList();
            setpatrons(PatronList);
            setkey(keyval + 1);
        }
    
        SetWarbandPatronOptions();
    }, []);
    
    async function updateItem(value: string) {
        await Warband.UpdateSelfPatron(value);
        UpdateFunction(Warband);
        setcurpatron(Warband.GetPatron());
        setkey(keyval + 1);
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with WarbandPatronDisplay.tsx</div>}>
            <div key={keyval}>

                <h2>Select Patron</h2>
                
                <Form.Control defaultValue={ curpatron != null? curpatron.ID : undefined} className={"borderstyler bordergrey overcomeradius " } as="select" aria-label="Default select example"  placeholder="Member Type" onChange={(e: { target: { value: any; }; }) => { updateItem(e.target.value)    } } >
                    <option value={""} key={"modeloptionnone"} >{"No Patron"}</option> 
                    {patrons.map((selec) => ( 
                        <option value={selec.ID} key={"modeloption"+(patrons.indexOf(selec).toString())} >{makestringpresentable(selec.Name? selec.Name : "")}</option> 
                    ))}
                </Form.Control>

                {curpatron != null &&
                    <>
                        <PatronDisplay data={curpatron}/>
                    </>
                }
            </div>
        </ErrorBoundary>
    )
}

export default WarbandPatronDisplay;