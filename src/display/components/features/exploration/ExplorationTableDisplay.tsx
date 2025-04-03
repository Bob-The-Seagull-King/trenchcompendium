import '../../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { GlossaryRule } from '../../../../classes/feature/glossary/Glossary'
import { returnDescription } from '../../../../utility/util'
import { ModelCollection } from '../../../../classes/feature/model/ModelCollection';
import { Model } from '../../../../classes/feature/model/Model';
import { Ability } from '../../../../classes/feature/ability/Ability';
import OptionSetStaticDisplay from '../../subcomponents/description/OptionSetStaticDisplay';
import { ExplorationTable } from '../../../../classes/feature/exploration/ExplorationTable';
import ExplorationLocationDisplay from './ExplorationLocationDisplay';
import GenericTableItemDisplay from '../../../components/generics/GenericTableItemDisplay';
import GenericTabledBlockDisplay from '../../../components/generics/GenereicTabledBlockDisplay';

const ExplorationTableDisplay = (props: any) => {
    const explorationTableObject: ExplorationTable = props.data

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ExplorationTableDisplay.tsx</div>}>
            <div className='borderthin bordergrey'>
                {explorationTableObject.ExplorationLocations.map((item) => (
                    <div key={item.ID}>
                        <GenericTabledBlockDisplay 
                                                d_name={item.Name} 
                                                d_colour={"grey"} 
                                                d_state={false}  
                                                bordertype={0}
                                                d_border={false}
                                                d_margin={"sml"}
                                                d_content={item.TableValue}
                                                d_method={() => <>
                                                    <div className="borderthin backgroundBgCard bordergrey">
                                                        <div className="totalmarginsml">
                                                            <ExplorationLocationDisplay data={item} />
                                                        </div>
                                                    </div>
                                                </>} />
                    </div>
                ))}
            </div>
        </ErrorBoundary>
    )
}

export default ExplorationTableDisplay;