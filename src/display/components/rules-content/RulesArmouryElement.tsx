import '../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'

// Classes
import FactionEquipmentDisplay from '../features/equipment/FactionEquipmentDisplay';


interface RulesArmouryElement {
    headline: string;
    items: any[];
}

const RulesArmouryElement: React.FC<RulesArmouryElement> = ({ headline, items }) => {

    return (
        <div className="RulesArmouryElement rules-card">
            <div className="armoury-headline rules-card-title">
                {headline}
            </div>
            <div className="armoury-content rules-card-content">
                {items.map((item) => (
                    <div key={item.ID} className="armoury-element">
                        <FactionEquipmentDisplay data={item} />
                    </div>
                ))}
            </div>
        </div>
    )
};

export default RulesArmouryElement;
