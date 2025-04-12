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

const WarbandPatronDisplay = (props: any) => {
    const Warband: UserWarband = props.wrbnd
    const Manager: WarbandManager = props.mngr
    const UpdateFunction = props.updater;

    const [patrons, setpatrons] = useState<Patron[]>([])
    const [key, setkey] = useState(0);

    useEffect(() => {
        async function SetWarbandPatronOptions() {                
            const PatronList = await Warband.GetPatronList();
            setpatrons(PatronList);

        }
    
        SetWarbandPatronOptions();
    }, []);

    return (
        <ErrorBoundary fallback={<div>Something went wrong with AbilityDisplay.tsx</div>}>
            <div className=''>
                
            </div>
        </ErrorBoundary>
    )
}

export default WarbandPatronDisplay;