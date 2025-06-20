import React from 'react'

interface WbbExplorationSkillProps {
    Name: string
    Description: string
    ID: string
    Sources: string[]
}

const WbbExplorationSkill: React.FC<WbbExplorationSkillProps> = ({
                                                                     Name,
                                                                     Description,
                                                                     ID,
                                                                     Sources
}) => {
    return (
        <div className="WbbExplorationSkill" data-skill-id={ID}>
            <div className={'WbbExplorationSkill-title'}>
                <span className={'WbbExplorationSkill-title-name'}>
                    {Name}
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
                        {Description}
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