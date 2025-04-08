import '../../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { GlossaryRule } from '../../../../classes/feature/glossary/Glossary'
import { returnDescription } from '../../../../utility/util'
import { ExplorationLocation } from '../../../../classes/feature/exploration/ExplorationLocation';
import OptionSetStaticDisplay from '../../../components/subcomponents/description/OptionSetStaticDisplay';
import { EventRunner } from '../../../../classes/contextevent/contexteventhandler';
import SingleOptionSetDisplay from "../../subcomponents/description/SingleOptionSetDisplay";

const RulesInjury = (props: any) => {

    return (
        <ErrorBoundary fallback={<div>Something went wrong with RulesInjury.tsx</div>}>
            <div className={'RulesInjury injury'}>
                <div className={'injury-name'}>
                    <strong>
                        {/* @TODO: Add Injury Name here*/}
                        {'Injury Name'}
                    </strong>

                </div>

                <p  className={'injury-description'}>
                    {/* @TODO: Add injury description here*/}
                    {'Innjury Description'}
                </p>
            </div>
        </ErrorBoundary>
    )
}

export default RulesInjury;