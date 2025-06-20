import React from 'react'
import WbbEditViewFighterSortable from "./modals/WbbEditViewFighterSortable";
import WbbExplorationSkill from "./WbbExplorationSkill";

const WbbExplorationSkills: React.FC = () => {

    const explorationSkills = [
        {
            Name: 'Extra Dice',
            ID: 'ex-extra-dice',
            Description: 'Roll 1 extra Exploration Die',
            Sources: [
                'Scavenger - Skill: Jaffar (Assassin)'
            ]
        },
        {
            Name: 'Duplicate',
            ID: 'ex-duplicate',
            Description: 'After you roll, select any Exploration Die and add another die with an identical result, including any modifications, to your total.',
            Sources: [
                'Hidden Passages - Legendary exploration location'
            ]
        },
        {
            Name: 'Re-roll',
            ID: 'ex-reroll',
            Description: 'Re-roll any Exploration Dice once.',
            Sources: [
                'Warband default',
                'Friends in High Places- Skill: Steve (Jabieran Alchemist)'
            ]

        }
    ]

    return (
        <div className="WbbExplorationSkills">
            {explorationSkills.map((explorationSkill, index) => (
                <WbbExplorationSkill
                    key={index}
                    Name={explorationSkill.Name}
                    Description={explorationSkill.Description}
                    ID={explorationSkill.ID}
                    Sources={explorationSkill.Sources}
                />
            ))}
        </div>
    )
}

export default WbbExplorationSkills