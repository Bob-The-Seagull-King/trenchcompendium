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
import GenericTableItemDisplay from '../../../components/generics/GenericTableItemDisplay';
import { SkillGroup } from '../../../../classes/feature/skillgroup/SkillGroup';
import SkillDisplay from './SkillDisplay';
import GenericTabledBlockDisplay from '../../../components/generics/GenereicTabledBlockDisplay';
import GenericCollapsableBlockDisplay from '../../../components/generics/GenericCollapsableBlockDisplay';

const SkillGroupDisplay = (props: any) => {
    const skillgroupObject : SkillGroup = props.data

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ExplorationTableDisplay.tsx</div>}>
            <div className=''>
                {skillgroupObject.Skills.map((item) => (
                    <div key={item.ID}>
                    {item.TableVal != -1 &&
                    <GenericTabledBlockDisplay 
                        d_name={item.Name} 
                        d_colour={"grey"} 
                        d_state={false}  
                        bordertype={0}
                        d_border={false}
                        d_margin={"sml"}
                        d_content={item.TableVal}
                        d_method={() => <>
                            <div className="borderthin backgroundBgCard bordergrey">
                                <div className="">
                                <SkillDisplay data={item} />
                                </div>
                            </div>
                        </>} />
                        }
                        {item.TableVal == -1 &&
                        <GenericCollapsableBlockDisplay 
                            d_name={item.Name} 
                            d_colour={"grey"} 
                            d_state={false}  
                            bordertype={0}
                            d_border={false}
                            d_margin={"sml"}
                            d_method={() => <>
                                <div className="borderthin backgroundBgCard bordergrey">
                                    <div className="">
                                    <SkillDisplay data={item} />
                                    </div>
                                </div>
                            </>} />
                        }
                    </div>
                ))}
            </div>
        </ErrorBoundary>
    )
}

export default SkillGroupDisplay;