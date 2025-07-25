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
import { WarbandProperty } from '../../../../../../classes/saveitems/Warband/WarbandProperty';
import { EventRunner } from '../../../../../../classes/contextevent/contexteventhandler';
import WarbandPropertyDisplay from '../WarbandKeyElements/WarbandPropertyDisplay';

const WarbandFactionDisplay = (props: any) => {
    const Warband: UserWarband = props.wrbnd
    const Manager: WarbandManager = props.mngr
    const UpdateFunction = props.updater;

    const [displayrules, setdisplayrules] = useState<WarbandProperty[]>([]);
    const [keyval, setkey] = useState(0);

    useEffect(() => {
        async function SetWarbandOptions() {    
            const EventProc: EventRunner = new EventRunner();
            
            const result_presentation = await EventProc.runEvent(
                "getWarbandLevelFactionRules",
                Warband.Faction,
                [],
                [],
                null
            );

            setdisplayrules(result_presentation);

            setkey(keyval + 1);
        }
    
        SetWarbandOptions();
    }, []);
    
    async function updateItem(value: string) {
        UpdateFunction(Warband);
        setkey(keyval + 1);
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with WarbandFactionDisplay.tsx</div>}>
            <div key={keyval}>
                {displayrules.map((item) => (
                    <WarbandPropertyDisplay key={item.ID} updater={UpdateFunction} wbprp={item} mngr={Manager} wrbnd={Warband}/>
                ))}
            </div>
        </ErrorBoundary>
    )
}

export default WarbandFactionDisplay;