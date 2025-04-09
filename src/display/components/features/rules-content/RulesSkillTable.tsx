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
import SkillDisplay from '../skill/SkillDisplay';
import GenericTabledBlockDisplay from '../../../components/generics/GenereicTabledBlockDisplay';
import GenericCollapsableBlockDisplay from '../../../components/generics/GenericCollapsableBlockDisplay';
import Rulesinjury from "./Rulesinjury";

const RulesSkillTable = (props: any) => {
    const skillgroupObject : SkillGroup = props.data

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ExplorationTableDisplay.tsx</div>}>
            <div className='RulesSkillTable rules-skill-table rules-card'>
                <div className={'rules-card-title rules-skill-table-title'}>
                    {skillgroupObject.Name}
                </div>

                <div className={'rules-card-content rules-card-table-content rules-skill-table-content'}>
                    <table className={'rules-card-table rules-injury-table-content-table'}>
                        <thead>
                            <tr>
                                <th>
                                    {'Score 2D6'}
                                </th>
                                <th>
                                    {'Skill'}
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                        {skillgroupObject.Skills.map((item) => (
                            <tr key={item.ID}>
                                <td className={'label-cell text-center'}>
                                    {item.TableVal != -1 &&
                                        <>
                                            {item.TableVal}
                                        </>
                                    }
                                </td>
                                <td>
                                    <div className={'skill-name'}>
                                        <strong>
                                            {item.Name}
                                        </strong>
                                    </div>

                                    <div className={'skill-description'}>
                                        <SkillDisplay data={item}/>
                                    </div>
                                </td>
                            </tr>
                        ))}


                        </tbody>
                    </table>
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default RulesSkillTable;