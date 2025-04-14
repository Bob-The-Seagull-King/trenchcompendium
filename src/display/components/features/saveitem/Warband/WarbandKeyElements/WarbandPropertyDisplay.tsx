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

const WarbandPropertyDisplay = (props: any) => {
    const Warband: UserWarband = props.wrbnd
    const Manager: WarbandManager = props.mngr
    const MyProp : WarbandProperty = props.wbprp
    const UpdateFunction = props.updater;

    const [keyval, setkey] = useState(0);

    useEffect(() => {
        async function SetWarbandOptions() {     
            setkey(keyval + 1);
        }
    
        SetWarbandOptions();
    }, []);
    
    async function updateItem(value: string) {
        UpdateFunction(Warband);
        setkey(keyval + 1);
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with AbilityDisplay.tsx</div>}>
            <div key={keyval}>
            </div>
        </ErrorBoundary>
    )
}

export default WarbandPropertyDisplay;