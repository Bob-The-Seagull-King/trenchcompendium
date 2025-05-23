import '../../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { GlossaryRule } from '../../../../classes/feature/glossary/Glossary'
import { returnDescription } from '../../../../utility/util'
import { Upgrade } from '../../../../classes/feature/ability/Upgrade';
import OptionSetStaticDisplay from '../../subcomponents/description/OptionSetStaticDisplay';

const UpgradeDisplay = (props: any) => {
    const abilityObject: Upgrade = props.data

    return (
        <ErrorBoundary fallback={<div>Something went wrong with UpgradeDisplay.tsx</div>}>
            <div className={'UpgradeDisplay'}>
                {returnDescription(abilityObject, abilityObject.Description)}
                <OptionSetStaticDisplay data={abilityObject.MyOptions} />
            </div>
        </ErrorBoundary>
    )
}

export default UpgradeDisplay;