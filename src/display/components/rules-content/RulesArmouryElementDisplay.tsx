import '../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'

// Classes
import FactionEquipmentDisplay from '../features/equipment/FactionEquipmentDisplay';


interface RulesArmouryElementDisplay {
    headline: string;
    items: any[];
}

const RulesArmouryElementDisplay: React.FC<RulesArmouryElementDisplay> = ({ headline, items }) => {

    return (
        <div className="armoury-section rules-card">
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

export default RulesArmouryElementDisplay;
