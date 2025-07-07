import React, { useEffect, useState } from 'react'
import WbbEditViewFighterSortable from "./modals/WbbEditViewFighterSortable";
import WbbExplorationSkill from "./WbbExplorationSkill";
import { useWarband } from '../../../context/WarbandContext';
import { ExplorationSkillSuite } from '../../../classes/saveitems/Warband/CoreElements/WarbandExplorationSet';

const WbbExplorationSkills: React.FC = () => {

    const {warband, updateKey} = useWarband();

    const [available, setAvailable] = useState<ExplorationSkillSuite[]>([]);
    const [keyvar, setkevvar] = useState(0);
    
    useEffect(() => {
        async function SetEquipmentOptions() {
            const options = await warband?.warband_data.GetExplorationSkillsInContext();
            if (options != undefined) {
                setAvailable(options)
                setkevvar(keyvar + 1)
            }
        }
    
        SetEquipmentOptions();
    }, [updateKey]);

    
    return (
        <div className="WbbExplorationSkills">
            {available.map((explorationSkill, index) => (
                <WbbExplorationSkill
                    key={index}
                    Skill={explorationSkill.skill}
                    ID={explorationSkill.skill.ID}
                    Sources={explorationSkill.sources}
                />
            ))}
        </div>
    )
}

export default WbbExplorationSkills