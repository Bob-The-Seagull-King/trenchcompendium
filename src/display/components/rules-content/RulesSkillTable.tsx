import '../../../resources/styles/vendor/bootstrap.css'
import React from 'react'
import { ErrorBoundary } from "react-error-boundary";

// Classes
import { SkillGroup } from '../../../classes/feature/skillgroup/SkillGroup';
import SkillDisplay from '../features/skill/SkillDisplay';

const RulesSkillTable = (props: any) => {
    const skillgroupObject : SkillGroup = props.data

    const showTableValColumn = skillgroupObject.Skills.some(skill => skill.TableVal !== -1);

    return (
        <ErrorBoundary fallback={<div>Something went wrong with ExplorationTableDisplay.tsx</div>}>
            <div className='RulesSkillTable rules-skill-table rules-card'>
                <div className={'rules-card-title rules-skill-table-title'}>
                    {skillgroupObject.Name}
                </div>

                <div className={'rules-card-content rules-card-table-content rules-skill-table-content'}>
                    <table className={'rules-card-table rules-skill-table-content-table'}>
                        <thead>
                            <tr>
                                {showTableValColumn &&
                                    <th>
                                        {'Score 2D6'}
                                    </th>
                                }
                                <th>
                                    {'Skill'}
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {skillgroupObject.Skills.map((item) => (
                                <tr key={item.ID}>
                                    {showTableValColumn &&
                                        <td className={'label-cell text-center'}>
                                            {item.TableVal != -1 &&
                                                <>
                                                    {item.TableVal}
                                                </>
                                            }
                                        </td>
                                    }
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