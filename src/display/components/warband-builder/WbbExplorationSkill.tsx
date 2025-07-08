import { WarbandProperty } from '../../../classes/saveitems/Warband/WarbandProperty'
import React from 'react'
import { returnDescription } from '../../../utility/util'

interface WbbExplorationSkillProps {
    Skill: WarbandProperty
    ID: string
    Sources: string[]
}

const WbbExplorationSkill: React.FC<WbbExplorationSkillProps> = ({
                                                                     Skill,
                                                                     ID,
                                                                     Sources
}) => {
    return (
        <div className="WbbExplorationSkill" data-skill-id={ID}>
            <div className={'WbbExplorationSkill-title'}>
                <span className={'WbbExplorationSkill-title-name'}>
                    {Skill.GetOwnName()}
                </span>

                <span className={'WbbExplorationSkill-title-num'}>
                    {Sources.length}
                </span>
            </div>

            <div className={'WbbExplorationSkill-content'}>
                <div className={'WbbExplorationSkill-content-rules'}>
                    <div>
                        <strong>
                            {'Rules'}
                        </strong>
                    </div>
                    <div>
                        {returnDescription( Skill, Skill.GetOwnDescription())}
                    </div>
                </div>

                <hr/>

                <div className={'WbbExplorationSkill-content-sources'}>
                    {Sources.map((Source, index) => (
                        <div key={index} className={'WbbExplorationSkill-content-source'}>
                            {Source}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default WbbExplorationSkill